import { Atom } from './Atom';
import { Formula } from './Formula';
import { DateTime } from 'luxon';
import { UsageError } from '../Errors';
import { DateCalculation } from './DateCalculation';

/**
 * Mathematical operations
 */
export enum operations {
    add = 'add',
    subtract = 'subtract',
    multiply = 'multiply',
    divide = 'divide',
    modulo = 'modulo',
}

/**
 * A function that is supposed to be used as argument for the Array.map() function, to map arguments to their rita-json ready counterparts.
 * @param item The item to be mapped
 * @example ```typescript
 *      const jsonArguments = someCalculation.arguments.map(mapParameterToJSONReady);
 */
export function mapArgumentsToJSONReady(
    item: Formula | number | Date | string
) {
    if (item instanceof Formula) {
        return item.toJsonReady();
    } else if (item instanceof Date) {
        return DateTime.fromJSDate(item).toISO();
    } else {
        return item;
    }
}

/**
 * Class for all calculations.
 * Calculations are also possible with Dates (for details see schema)
 */
export class Calculation extends Formula {
    /**
     * The arguments of the calculation
     */
    public arguments: Array<
        Atom | number | Date | Calculation | DateCalculation
    >;

    /**
     * The operation of the calculation
     */
    public operation: operations;

    /**
     *
     * @param formulaArguments The arguments of the calculation
     * @param operation The operation of the calculation
     */
    constructor(
        formulaArguments: Array<Atom | number | Calculation | DateCalculation>,
        operation: operations
    ) {
        super();
        this.arguments = formulaArguments;
        this.operation = operation;
    }

    async evaluate(data: Record<string, any>): Promise<Date | number> {
        //Get the function matching our operation
        let tempFunc: (x1: any, x2: any) => number;
        switch (this.operation) {
            case operations.add:
                tempFunc = (x1, x2) => x1 + x2;
                break;
            case operations.subtract:
                tempFunc = (x1, x2) => x1 - x2;
                break;
            case operations.multiply:
                tempFunc = (x1, x2) => x1 * x2;
                break;
            case operations.divide:
                tempFunc = (x1, x2) => {
                    if (x2 === 0)
                        throw new UsageError('Division by zero is not allowed');
                    return x1 / x2;
                };
                break;
            case operations.modulo:
                tempFunc = (x1, x2) => {
                    if (x2 === 0)
                        throw new UsageError('Division by zero is not allowed');
                    return x1 - Math.floor(x1 / x2) * x2;
                };
                break;
        }

        // Round to 12 decimals to circumvent javascript weirdness
        const func = (x1: any, x2: any) =>
            Math.round(tempFunc(x1, x2) * 10e12) / 10e12;

        //Now evaluate all arguments if they can be evaluated
        let results = await Promise.all(
            this.arguments.map(async (item) =>
                item instanceof Formula ? await item.evaluate(data) : item
            )
        );

        //Check if dates are involved in th calculation
        for (const parameter of results) {
            if (parameter instanceof Date) {
                throw new UsageError(
                    'No dates in calculation allowed! Use dateCalculation'
                );
            }
        }

        //No dates are involved, just reduce the array with the function
        return <number>results.splice(1).reduce(func, results[0]);
    }

    toJsonReady(): Record<string, any> {
        return {
            type: 'calculation',
            operation: this.operation,
            arguments: this.arguments.map(mapArgumentsToJSONReady),
        };
    }

    validate(): boolean {
        return (
            this.arguments.length >= 2 &&
            this.arguments
                .map((it) => (it instanceof Formula ? it.validate() : !!it))
                .reduce((p, c) => p && c)
        );
    }
}
