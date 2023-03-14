import { Formula } from './Formula';
import { Atom } from './Atom';
import { UsageError } from '../Errors';

export class Quantifier extends Formula {
    /**
     * Describes which quantifier this is
     */
    public quantifier: 'forall' | 'exists';

    /**
     * The of the quantifier
     */
    public array: Atom | Array<Formula>;

    /**
     * The property name under which the current array value will be merged into the data.
     */
    public placeholder: string;

    /**
     * The formula to evaluate for each value
     */
    public formula: Formula;

    constructor(
        quantifier: 'forall' | 'exists',
        array: Atom | Array<Formula>,
        placeholder: string,
        formula: Formula
    ) {
        super();
        this.quantifier = quantifier;
        this.array = array;
        this.placeholder = placeholder;
        this.formula = formula;
    }

    async evaluate(data: Record<string, any>): Promise<boolean> {
        //Get the array from the data
        let ar;
        if (Array.isArray(this.array)) {
            ar = await Promise.all(
                this.array.map((item) => item.evaluate(data))
            );
        } else {
            ar = await this.array.evaluate(data);
        }
        //Check that it is indeed an array
        if (!Array.isArray(ar)) {
            throw new UsageError(
                "Property 'array' in a quantifier must be an array!"
            );
        }

        //Execute forall respectively exists
        for (const arrayElement of ar) {
            data[this.placeholder] = arrayElement;
            const res = await this.formula.evaluate(data);
            if (this.quantifier === 'forall' && !res) {
                return false;
            }
            if (this.quantifier === 'exists' && res) {
                return true;
            }
        }
        return this.quantifier === 'forall';
    }

    toJsonReady(): Record<string, any> {
        return {
            type: this.quantifier,
            array: Array.isArray(this.array)
                ? this.array.map((it) => it.toJsonReady())
                : this.array.toJsonReady(),
            placeholder: this.placeholder,
            rule: this.formula.toJsonReady(),
        };
    }

    validate(): boolean {
        return (
            this.placeholder.length !== 0 &&
            (Array.isArray(this.array)
                ? this.array.map((it) => it.validate()).reduce((p, c) => p && c)
                : this.array.validate())
        );
    }
}
