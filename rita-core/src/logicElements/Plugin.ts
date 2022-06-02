import { Formula, FormulaResults } from './Formula';

export abstract class PluginInterface extends Formula {
    options: Record<any, any>;
    formula: Formula;
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

    abstract enrichData(data: Record<string, any>): Record<string, any>;
}
