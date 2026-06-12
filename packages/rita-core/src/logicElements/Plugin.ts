import { Formula, FormulaResults } from './Formula';
import { UsageError } from '../Errors';
import { Logger } from '../Logger';

/**
 * Type of class that extends Plugin
 */
export type PluginClass = {
    new (options: Record<any, any>, childFormula: Formula | undefined): Plugin;
};

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
    formula: Formula | undefined;

    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected -> can't be made protected because it's needed for PluginClass type
    constructor(options: Record<any, any>, childFormula: Formula | undefined) {
        super();
        this.options = options;
        this.formula = childFormula;
    }

    async evaluate(
        data: Record<string, any>
    ): Promise<FormulaResults | Array<FormulaResults>> {
        if (!this.formula) throw new UsageError('Empty formula', this);
        return this.formula.evaluate(await this.enrichData(data));
    }

    validate(): boolean {
        if (!this.formula) throw new UsageError('Empty formula', this);
        return this.formula.validate();
    }

    toJsonReady(): Record<string, any> {
        return {
            type: 'plugin',
            name: this.getName(),
            options: this.options,
            formula: this.formula,
        };
    }

    /**
     * Enriches the data for the child formula
     * @param data The original data for evaluation
     * @param logger Optionally pass a logger
     * @return The enriched data that is then used to evaluate the child formula
     */
    abstract enrichData(
        data: Record<string, any>,
        logger?: Logger
    ): Promise<Record<string, any>>;

    /**
     * Get the name of the plugin
     */
    abstract getName(): string;

    /**
     * Get the version of the plugin
     */
    abstract getVersion(): string;
}
