import {
    Add,
    And,
    DeclareConst,
    Div,
    Eq,
    GEq,
    GT,
    LEq,
    LocalCVC5Solver,
    LT,
    Mult,
    Not,
    Or,
    SatResult,
    SExpr,
    SNode,
    Sub,
} from '@educorvi/smtlib';
import {
    Atom,
    Calculation,
    Comparison,
    comparisons,
    Formula,
    operations,
    Operator,
    Rule,
} from '@educorvi/rita';
import { GEqS, GTS, LEqS, LTS, Mod } from './customSMTFunctions';

enum types {
    boolean = 'Bool',
    number = 'Real',
    string = 'String',
}

type RitaSatResult = {
    satisfieable: boolean;
    model: Record<string, any> | undefined;
};

export default class SmtSolver {
    private readonly solver: LocalCVC5Solver = new LocalCVC5Solver('ALL');
    private declaredConsts: Array<string> = [];

    constructor(produceModel = false) {
        if (produceModel) {
            this.solver.enableAssignments();
        }
        this.defineCustomFunctions();
    }

    private defineCustomFunctions() {
        //Modulo
        this.solver.defineFun(
            '%',
            [new SExpr('a Real'), new SExpr('b Real')],
            'Real',
            Sub('a', Mult(new SExpr('to_int', Div('a', 'b')), 'b'))
        );

        //<= String
        this.solver.defineFun(
            '<=s',
            [new SExpr('a String'), new SExpr('b String')],
            'Bool',
            new SExpr('str.<=', 'a', 'b')
        );

        //< String
        this.solver.defineFun(
            '<s',
            [new SExpr('a String'), new SExpr('b String')],
            'Bool',
            And(new SExpr('str.<=', 'a', 'b'), Not(Eq('a', 'b')))
        );

        //> String
        this.solver.defineFun(
            '>s',
            [new SExpr('a String'), new SExpr('b String')],
            'Bool',
            Not(And(new SExpr('str.<=', 'a', 'b'), Not(Eq('a', 'b'))))
        );

        //>= String
        this.solver.defineFun(
            '>=s',
            [new SExpr('a String'), new SExpr('b String')],
            'Bool',
            Or(new SExpr('>s', 'a', 'b'), Eq('a', 'b'))
        );
    }

    public dump() {
        this.solver.dump();
    }

    public simplify(formula: SNode) {
        return this.solver.simplify(formula);
    }

    public readonly output = this.solver.output;

    private static getModel(
        satResult: SatResult
    ): Record<string, any> | undefined {
        if (!satResult.model) {
            return undefined;
        }
        console.log(satResult.model);
        const o = {};
        for (const key of Object.keys(satResult.model)) {
            this.setPropertyByString(o, key, satResult.model[key]);
        }

        return o;
    }

    public async checkSat(): Promise<RitaSatResult> {
        const satRet = await this.solver.checkSat();
        return {
            satisfieable: satRet.satisfieable,
            model: SmtSolver.getModel(satRet),
        };
    }

    private declareConstIfNotExists(name: string, type: string) {
        if (!this.declaredConsts.includes(name)) {
            this.solver.add(DeclareConst(name, type));
            this.declaredConsts.push(name);
        }
    }

    parseFormula(
        rule: Formula | string | number | Date,
        type: types = types.boolean
    ): SNode {
        if (typeof rule === 'string') {
            return `"${rule}"`;
        }
        if (typeof rule === 'number') {
            return rule.toString();
        }
        if (rule instanceof Date) {
            return rule.getTime().toString();
        }

        if (rule instanceof Operator) {
            return this.parseOperator(rule);
        } else if (rule instanceof Atom) {
            return this.parseAtom(rule, type);
        } else if (rule instanceof Comparison) {
            return this.parseComparison(rule);
        } else if (rule instanceof Calculation) {
            return this.parseCalculation(rule);
        } else {
            throw new Error('unknown:\n' + JSON.stringify(rule.toJsonReady()));
        }
    }

    private parseCalculation(rule: Calculation): SNode {
        const funcArgs: Array<SNode | string> = [];
        for (const argument of rule.arguments) {
            funcArgs.push(this.parseFormula(argument, types.number));
        }
        switch (rule.operation) {
            case operations.add:
                return Add(...funcArgs);
            case operations.subtract:
                return Sub(...funcArgs);
            case operations.multiply:
                return Mult(...funcArgs);
            case operations.divide:
                return Div(...funcArgs);
            case operations.modulo:
                if (funcArgs.length !== 2)
                    throw new Error(
                        'For modulo only two arguments are supported'
                    );
                return Mod(funcArgs[0], funcArgs[1]);
            default:
                throw new Error(
                    'unknown:\n' + JSON.stringify(rule.toJsonReady())
                );
        }
    }

    private parseComparison(rule: Comparison): SNode {
        let func: (l: SNode, r: SNode) => SNode;

        const stringsInvolved =
            typeof rule.arguments[0] === 'string' ||
            typeof rule.arguments[1] === 'string';
        switch (rule.operation) {
            case comparisons.equal:
                func = Eq;
                break;
            case comparisons.smaller:
                if (stringsInvolved) {
                    func = LTS;
                } else {
                    func = LT;
                }
                break;
            case comparisons.smallerOrEqual:
                if (stringsInvolved) {
                    func = LEqS;
                } else {
                    func = LEq;
                }
                break;
            case comparisons.greater:
                if (stringsInvolved) {
                    func = GTS;
                } else {
                    func = GT;
                }
                break;
            case comparisons.greaterOrEqual:
                if (stringsInvolved) {
                    func = GEqS;
                } else {
                    func = GEq;
                }
                break;
            default:
                throw new Error(
                    'unknown:\n' + JSON.stringify(rule.toJsonReady())
                );
        }
        let type = types.number;
        for (const argument of rule.arguments) {
            if (typeof argument === 'string') {
                type = types.string;
            }
        }
        return func(
            this.parseFormula(rule.arguments[0], type),
            this.parseFormula(rule.arguments[1], type)
        );
    }

    private parseOperator(rule: Operator): SNode {
        let func: (...args: SNode[]) => SNode;
        switch (rule.toJsonReady().type) {
            case 'and':
                func = And;
                break;
            case 'or':
                func = Or;
                break;
            case 'not':
                func = Not;
                break;
            default:
                throw new Error(
                    'unknown:\n' + JSON.stringify(rule.toJsonReady())
                );
        }
        const funcArgs: Array<SNode | string> = [];
        for (const argument of rule.arguments) {
            funcArgs.push(this.parseFormula(argument));
        }
        return func(...funcArgs);
    }

    assertRule(rule: Rule) {
        this.solver.assert(this.parseFormula(rule.rule));
    }

    private parseAtom(rule: Atom, type: types): string {
        this.declareConstIfNotExists(rule.path, type);
        return rule.path;
    }

    private static setPropertyByString(o: any, s: string, v: any): void {
        s = s.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, ''); // strip a leading dot
        const a = s.split('.');
        for (let i = 0, n = a.length; i < n - 1; ++i) {
            const k = a[i];
            if (!(k in o)) {
                o[k] = {};
            }
            o = o[k];
        }
        o[a[a.length - 1]] = v;
    }
}
