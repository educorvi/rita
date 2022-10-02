import {
    And,
    Atom,
    Calculation,
    Comparison,
    Formula,
    Macro,
    Not,
    Operator,
    Or,
    Quantifier,
    Rule,
    parseDate,
    parseDateOrReturnString,
} from './logicElements';
import Ajv from 'ajv/dist/2019';
import schemas, { schema } from './schema';
import { AnyValidateFunction } from 'ajv/dist/types';
import addFormats from 'ajv-formats';
import { InternalError, UnimplementedError, UsageError } from './Errors';
import { PluginClass } from './logicElements/Plugin';
import { DateCalculation } from './logicElements/DateCalculation';

const ajv = new Ajv({ schemas: schemas });
addFormats(ajv);

/**
 * Results for validateRuleJSON
 */
interface validationResult {
    /**
     * Indicates, if the rule is valid
     */
    valid: boolean;
    /**
     * Array of errors
     */
    errors: Array<any>;
}

/**
 * Class for all actions related to parsing
 */
export default class Parser {
    /**
     * The validate function used to validate RITA Json
     * @private
     */
    private readonly validate: AnyValidateFunction<unknown> | undefined;

    private readonly plugins: Map<string, PluginClass> = new Map<
        string,
        PluginClass
    >();

    constructor(plugins?: Array<PluginClass>) {
        this.validate = ajv.getSchema(
            'https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/schema.json'
        );

        if (plugins) {
            for (const plugin of plugins) {
                this.plugins.set(new plugin({}, undefined).getName(), plugin);
            }
        }
    }

    /**
     * Check if a given RITA Ruleset is valid
     * @param json the ruleset
     */
    public validateRuleSetJSON(json: Record<string, any>): validationResult {
        if (!this.validate) {
            throw new InternalError('Error compiling schema');
        }
        let valid = this.validate(json);
        if (typeof valid !== 'boolean') {
            throw new InternalError('Error compiling schema');
        }
        return {
            valid,
            errors: this.validate.errors || [],
        };
    }

    /**
     * Create an Array of Rule objects from a json ruleset
     * @param jsonRuleset the ruleset
     */
    public parseRuleSet(jsonRuleset: Record<string, any>): Array<Rule> {
        return jsonRuleset.rules.map((item: Record<string, any>) =>
            this.parseRule(item)
        );
    }

    /**
     * Create Rule from json
     * @param jsonRuleset the rule
     */
    public parseRule(jsonRuleset: Record<string, any>): Rule {
        return new Rule(
            jsonRuleset['id'],
            this.parseFormula(jsonRuleset['rule']),
            jsonRuleset['comment']
        );
    }

    /**
     * Create Rule from json
     * @param jsonRuleset
     */
    public parseFormula(jsonRuleset: Record<string, any>): Formula {
        switch (jsonRuleset['type']) {
            case 'atom':
                return this.parseAtom(jsonRuleset);
            case 'comparison':
                return this.parseComparison(jsonRuleset);
            case 'calculation':
                return this.parseCalculation(jsonRuleset);
            case 'dateCalculation':
                return this.parseDateCalculation(jsonRuleset);
            case 'forall':
            case 'exists':
                return this.parseQuantifier(jsonRuleset);
            case 'and':
            case 'or':
            case 'not':
                return this.parseOperator(jsonRuleset);
            case 'macro':
                return this.parseMacro(jsonRuleset);
            case 'plugin':
                return this.parsePlugin(jsonRuleset);
            default:
                throw new UnimplementedError(
                    jsonRuleset['type'] + ' is not implemented'
                );
        }
    }

    /**
     * Create Operator from json
     * @param jsonRuleset the operator
     */
    public parseOperator(jsonRuleset: Record<string, any>): Operator {
        const type: 'not' | 'or' | 'and' = jsonRuleset['type'];
        const formulaArguments: Array<Formula> = [];
        for (const parameter of jsonRuleset['arguments']) {
            formulaArguments.push(this.parseFormula(parameter));
        }
        switch (type) {
            case 'not':
                return new Not(formulaArguments);
            case 'and':
                return new And(formulaArguments);
            case 'or':
                return new Or(formulaArguments);
        }
    }

    /**
     * Create Atom from json
     * @param jsonRuleset the atom
     */
    public parseAtom(jsonRuleset: Record<string, any>): Atom {
        return new Atom(jsonRuleset['path'], !!jsonRuleset['isDate']);
    }

    /**
     * Parse the arguments of a comparison
     * @param formulaArguments the arguments
     * @private
     */
    private parseComparisonParams(
        formulaArguments: Array<number | string | Record<string, any>>
    ): Array<Atom | number | Date | string | Calculation> {
        const params = [];
        for (const parameter of formulaArguments) {
            if (typeof parameter === 'number') {
                params.push(parameter);
            } else if (typeof parameter === 'string') {
                params.push(parseDateOrReturnString(parameter));
            } else {
                params.push(<Atom | Calculation>this.parseFormula(parameter));
            }
        }
        return params;
    }

    /**
     * Parse a comparison
     * @param jsonRuleset
     */
    public parseComparison(jsonRuleset: Record<string, any>): Comparison {
        return new Comparison(
            this.parseComparisonParams(jsonRuleset['arguments']),
            jsonRuleset['operation']
        );
    }

    /**
     * Parse the arguments of a calculation
     * @param formulaArguments the arguments
     * @private
     */
    private parseCalculationParams(
        formulaArguments: Array<number | Record<string, any>>
    ): Array<Atom | number | Calculation> {
        const params = [];
        for (const parameter of formulaArguments) {
            if (typeof parameter === 'number') {
                params.push(parameter);
            } else {
                params.push(<Atom | Calculation>this.parseFormula(parameter));
            }
        }
        return params;
    }

    /**
     * Parse the arguments of a calculation
     * @param formulaArguments the arguments
     * @private
     */
    private parseDateCalculationParams(
        formulaArguments: Array<number | string | Record<string, any>>
    ): Array<Atom | number | Date | Calculation> {
        const params = [];
        for (const parameter of formulaArguments) {
            if (typeof parameter === 'number') {
                params.push(parameter);
            } else if (typeof parameter === 'string') {
                params.push(parseDate(parameter));
            } else {
                params.push(<Atom | Calculation>this.parseFormula(parameter));
            }
        }
        return params;
    }

    /**
     * Parse a Calculation
     * @param jsonRuleset
     */
    public parseCalculation(jsonRuleset: Record<string, any>): Calculation {
        return new Calculation(
            this.parseCalculationParams(jsonRuleset['arguments']),
            jsonRuleset['operation']
        );
    }

    /**
     * Parse a DateCalculation
     * @param jsonRuleset
     */
    public parseDateCalculation(
        jsonRuleset: Record<string, any>
    ): DateCalculation {
        return new DateCalculation(
            this.parseDateCalculationParams(jsonRuleset['arguments']),
            jsonRuleset['operation'],
            jsonRuleset['dateResultUnit'],
            jsonRuleset['dateCalculationUnit']
        );
    }

    public parseQuantifier(jsonRuleset: Record<string, any>): Quantifier {
        let array;
        if (Array.isArray(jsonRuleset['array'])) {
            array = jsonRuleset['array'].map((item) => this.parseFormula(item));
        } else {
            array = this.parseAtom(jsonRuleset['array']);
        }
        return new Quantifier(
            jsonRuleset['type'],
            array,
            jsonRuleset['placeholder'],
            this.parseFormula(jsonRuleset['rule'])
        );
    }

    public parseMacro(jsonRuleset: Record<string, any>): Macro {
        let array = undefined;
        if (jsonRuleset['macro']['type'] === 'length') {
            array = this.parseAtom(jsonRuleset['macro']['array']);
        }
        return new Macro(jsonRuleset['macro']['type'], array);
    }

    public parsePlugin(jsonRuleset: Record<string, any>) {
        const name = jsonRuleset['name'];
        const Plugin = this.plugins.get(name);
        if (!Plugin) {
            throw new UsageError(`Plugin ${name} is not registered!`);
        }
        return new Plugin(
            jsonRuleset['options'],
            this.parseFormula(jsonRuleset['formula'])
        );
    }

    /**
     * Turn an array of rule objects back into a json ruleset
     * @param rules the array of rules
     */
    public static toJson(rules: Array<Rule>): string {
        return JSON.stringify({
            $schema: schema['$id'],
            rules: rules.map((rule) => rule.toJsonReady()),
        });
    }

    toJson = Parser.toJson;
}
