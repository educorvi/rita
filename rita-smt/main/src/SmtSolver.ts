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
    NEq,
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
    DateCalculation,
    dateOperations,
    Formula,
    operations,
    Operator,
    Rule,
} from '@educorvi/rita';
import { GEqS, GTS, LEqS, LTS, Mod } from './customSMTFunctions';
import { accurateMatrix as conversionMatrix } from './conversionMatrices';

enum types {
    boolean = 'Bool',
    number = 'Real',
    string = 'String',
}

type RitaSatResult = {
    satisfiable: boolean;
    model: Record<string, any> | undefined;
};

/**
 * This class can be used translate from rita to SMT-LIB and use the solver provided by node-smtlib package to solve those translations
 */
export default class SmtSolver {
    private solver: LocalCVC5Solver;

    public output: Array<string>;
    private declaredConsts: Array<string> = [];
    private atoms: Array<Atom> = [];

    constructor(produceModel = false, timelimit?: number) {
        this.solver = new LocalCVC5Solver('QF_SNIRA', timelimit);
        this.output = this.solver.output;
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

    private getModel(satResult: SatResult): Record<string, any> | undefined {
        if (!satResult.model) {
            return undefined;
        }
        const o = {};
        for (const key of Object.keys(satResult.model)) {
            let val: any = satResult.model[key];
            if (
                this.atoms.filter((at) => at.path === key && at.isDate).length
            ) {
                val = new Date(
                    Number.parseInt(satResult.model[key].toString())
                );
            }
            SmtSolver.setPropertyByString(o, key, val);
        }

        return o;
    }

    public async checkSat(): Promise<RitaSatResult> {
        const satRet = await this.solver.checkSat();
        return {
            satisfiable: satRet.satisfiable,
            model: this.getModel(satRet),
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
            const formatter = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 1,
                useGrouping: false,
            });
            if (rule >= 0) {
                return formatter.format(rule);
            } else {
                return `(- ${formatter.format(Math.abs(rule))})`;
            }
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
        } else if (rule instanceof DateCalculation) {
            return this.parseDateCalculation(rule);
        } else {
            throw new Error(
                'unknown type:\n' + JSON.stringify(rule.toJsonReady())
            );
        }
    }

    private parseCalculation(rule: Calculation): SNode {
        const funcArgs: Array<SNode | string> = [];
        for (const argument of rule.arguments) {
            funcArgs.push(this.parseFormula(argument, types.number));
        }
        if (
            rule.operation === operations.divide ||
            rule.operation === operations.modulo
        ) {
            for (let i = 1; i < funcArgs.length; i++) {
                const funcArg = funcArgs[i];
                this.solver.assert(NEq(funcArg, '0'));
            }
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
                if (funcArgs.length !== 2) {
                    throw new Error(
                        'For modulo only two arguments are supported'
                    );
                }
                return Mod(funcArgs[0], funcArgs[1]);
            default:
                throw new Error(
                    'unknown:\n' + JSON.stringify(rule.toJsonReady())
                );
        }
    }

    private isDate(arg: number | Atom | Date | Calculation | DateCalculation) {
        return (
            arg instanceof Date ||
            (arg instanceof Atom && arg.isDate) ||
            (arg instanceof DateCalculation && this.returnsDate(arg))
        );
    }

    private returnsDate(calc: DateCalculation): boolean {
        return (
            this.isDate(calc.arguments[0]) !== this.isDate(calc.arguments[1])
        );
    }

    private parseDateCalculation(rule: DateCalculation): SNode {
        const funcArgs: Array<SNode | string> = rule.arguments.map((v) => {
            if (this.isDate(v)) {
                return this.parseFormula(v, types.number);
            } else {
                return Mult(
                    this.parseFormula(v, types.number),
                    conversionMatrix[rule.dateCalculationUnit || 'seconds'][
                        'milliseconds'
                    ].toString()
                );
            }
        });
        // for (const argument of rule.arguments) {
        //     funcArgs.push(this.parseFormula(argument, types.number));
        // }

        let wrapOperation: (result: SNode) => SNode;
        if (!this.returnsDate(rule)) {
            wrapOperation = (res) =>
                Div(
                    res,
                    conversionMatrix[rule.dateResultUnit || 'seconds'][
                        'milliseconds'
                    ].toString()
                );
        } else {
            wrapOperation = (res) => res;
        }
        switch (rule.operation) {
            case dateOperations.add:
                return wrapOperation(Add(...funcArgs));
            case dateOperations.subtract:
                return wrapOperation(Sub(...funcArgs));
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

    assertSMT(rule: SNode) {
        this.solver.assert(rule);
    }

    private parseAtom(rule: Atom, type: types): string {
        const path = rule.path.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
        this.declareConstIfNotExists(path, type);
        this.atoms.push(rule);
        return path;
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
