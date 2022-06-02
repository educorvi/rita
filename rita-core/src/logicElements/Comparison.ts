import { Formula } from './Formula';
import { Atom } from './Atom';
import { Calculation, mapArgumentsToJSONReady } from './Calculation';
import { RulesetError, UnimplementedError } from '../Errors';

/**
 * Types of comparisons
 */
export enum comparisons {
    equal = 'equal',
    smaller = 'smaller',
    greater = 'greater',
    smallerOrEqual = 'smallerOrEqual',
    greaterOrEqual = 'greaterOrEqual',
}

/**
 * Parent class for all Comparisons
 */
export class Comparison extends Formula {
    /**
     * The arguments of the comparison
     */
    public arguments: Array<Atom | number | Date | string | Calculation>;

    /**
     * Type of the comparison
     */
    public operation: comparisons;

    /**
     * @constructor
     * @param formulaArguments The arguments
     * @param operation Type of the comparison
     */
    constructor(
        formulaArguments: Array<Atom | number | Date | string | Calculation>,
        operation: comparisons
    ) {
        super();
        this.arguments = formulaArguments;
        this.operation = operation;
    }

    toJsonReady(): Record<string, any> {
        return {
            type: 'comparison',
            operation: this.operation,
            arguments: this.arguments.map(mapArgumentsToJSONReady),
        };
    }

    evaluate(data: Record<string, any>): boolean {
        if(!this.validate()) throw new RulesetError('Invalid: ' + JSON.stringify(this.toJsonReady()));

        //if one of the arguments is either an Atom or a Calculation evaluate it first
        const p1 =
            this.arguments[0] instanceof Formula
                ? this.arguments[0].evaluate(data)
                : this.arguments[0];
        const p2 =
            this.arguments[1] instanceof Formula
                ? this.arguments[1].evaluate(data)
                : this.arguments[1];

        if (p1 === undefined || p2 === undefined) return false;

        switch (this.operation) {
            case comparisons.equal:
                return p1 === p2;
            case comparisons.greater:
                return p1 > p2;
            case comparisons.greaterOrEqual:
                return p1 >= p2;
            case comparisons.smaller:
                return p1 < p2;
            case comparisons.smallerOrEqual:
                return p1 <= p2;
            default:
                throw new UnimplementedError(
                    'Unknown operation: ' + this.operation
                );
        }
    }

    validate(): boolean {
        return this.arguments.length === 2
            && this.arguments.map((it) =>
                it instanceof Formula ? it.validate() : !!it)
                .reduce((p, c) => p && c);
    }
}
