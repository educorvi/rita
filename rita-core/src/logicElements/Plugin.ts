import { Formula, FormulaResults } from './Formula';

/**
 * When a rule is evaluated, the `enrichData` function is called and the data to evaluate against is passed to this plugin.
 * The plugin is supposed to create its own data (or enrich the data object that is passed to it) and return it.
 * This new object will then be used to evaluate the formula inside the plugin
 */
export abstract class Plugin extends Formula {
    /**
     * The options given to this plugin
     */
    options: Record<any, any>;

    /**
     * The formula that will be evaluated with the enriched data
     */
    formula: Formula;

    /**
     * The name of the plugin
     */
    readonly name: string;

    protected constructor(
        options: Record<any, any>,
        childFormula: Formula,
        name: string
    ) {
        super();
        this.options = options;
        this.formula = childFormula;
        this.name = name;
    }

    evaluate(
        data: Record<string, any>
    ): FormulaResults | Array<FormulaResults> {
        return this.formula.evaluate(this.enrichData(data));
    }

    validate(): boolean {
        return this.formula.validate();
    }

    toJsonReady(): Record<string, any> {
        return {
            type: 'plugin',
            name: this.name,
            options: this.options,
            formula: this.formula,
        };
    }

    /**
     * Enriches the data for the child formula
     * @param data The original data for evaluation
     * @return The enriched data that is then used to evaluate the child formula
     */
    abstract enrichData(data: Record<string, any>): Record<string, any>;
}
