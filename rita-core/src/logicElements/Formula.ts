export type FormulaResults = boolean | Date | number | string;

export abstract class Formula {
    /**
     * Evaluates the formula with the given data
     * @param data The data that's used for evaluation
     */
    abstract evaluate(
        data: Record<string, any>
    ): Promise<FormulaResults | Array<FormulaResults>>;

    /**
     * Check if the formula is valid
     */
    abstract validate(): boolean;

    /**
     * Prepares object for conversion into rita json
     * @internal
     */
    abstract toJsonReady(): Record<string, any>;
}
