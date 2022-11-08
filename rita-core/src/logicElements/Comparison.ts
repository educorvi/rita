import { Formula } from './Formula';
import { Atom } from './Atom';
import { Calculation, mapArgumentsToJSONReady } from './Calculation';
import { UnimplementedError } from '../Errors';

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
     * Indicates if dates are compared
     */
    public dates: boolean;

    /**
     * @constructor
     * @param formulaArguments The arguments
     * @param operation Type of the comparison
     * @param dates Indicates if dates are compared
     */
    constructor(
        formulaArguments: Array<Atom | number | Date | string | Calculation>,
        operation: comparisons,
        dates: boolean
    ) {
        super();
        this.arguments = formulaArguments;
        this.operation = operation;
        this.dates = dates;
    }

    toJsonReady(): Record<string, any> {
        return {
            type: 'comparison',
            operation: this.operation,
            arguments: this.arguments.map(mapArgumentsToJSONReady),
            dates: this.dates,
        };
    }

    async evaluate(data: Record<string, any>): Promise<boolean> {
        //if one of the arguments is either an Atom or a Calculation evaluate it first
        let p1 =
            this.arguments[0] instanceof Formula
                ? await this.arguments[0].evaluate(data)
                : this.arguments[0];
        let p2 =
            this.arguments[1] instanceof Formula
                ? await this.arguments[1].evaluate(data)
                : this.arguments[1];

        if (p1 === undefined || p2 === undefined) return false;

        if (p1 instanceof Date) p1 = p1.getTime();
        if (p2 instanceof Date) p2 = p2.getTime();

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
        return (
            this.arguments.length === 2 &&
            this.arguments
                .map((it) => (it instanceof Formula ? it.validate() : !!it))
                .reduce((p, c) => p && c)
        );
    }
}
