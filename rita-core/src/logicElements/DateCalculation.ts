/**
 * Mathematical operations
 */
import { Formula, FormulaResults } from './Formula';
import { Atom } from './Atom';
import { Calculation, mapArgumentsToJSONReady } from './Calculation';
import { RulesetError } from '../Errors';
import { assertNumberOrDate } from '../Assertions';
import { Temporal } from 'temporal-polyfill';

export enum dateOperations {
    add = 'add',
    subtract = 'subtract',
}

/**
 * Possible units for time intervals
 */
enum timeUnits {
    seconds = 'seconds',
    minutes = 'minutes',
    hours = 'hours',
    days = 'days',
    months = 'months',
    years = 'years',
}

/**
 * Longterm millisecond values for time units (matching luxon's conversionAccuracy: 'longterm').
 * 1 year = 365.2425 days (Gregorian calendar average)
 */
const msPerUnit: Record<timeUnits, number> = {
    [timeUnits.seconds]: 1_000,
    [timeUnits.minutes]: 60_000,
    [timeUnits.hours]: 3_600_000,
    [timeUnits.days]: 86_400_000,
    [timeUnits.months]: 2_629_746_000, // 365.2425 / 12 * 86400000
    [timeUnits.years]: 31_557_600_000, // 365.2425 * 86400000
};

export class DateCalculation extends Formula {
    /**
     * The arguments of the calculation
     */
    public arguments: Array<
        Atom | number | Date | Calculation | DateCalculation
    >;

    /**
     * The operation of the calculation
     */
    public operation: dateOperations;

    /**
     * The unit of the result of the calculation when calculating with dates and result is a number
     */
    public dateResultUnit: timeUnits;

    /**
     * The unit to calculate with when calculating with dates and numbers
     */
    public dateCalculationUnit: timeUnits;

    /**
     *
     * @param formulaArguments The arguments of the calculation
     * @param operation The operation of the calculation
     * @param dateResultUnit The unit of the result of the calculation when calculating with dates and result is a number
     * @param dateCalculationUnit The unit to calculate when calculating with dates and numbers
     */
    constructor(
        formulaArguments: Array<
            Atom | number | Date | Calculation | DateCalculation
        >,
        operation: dateOperations,
        dateResultUnit: timeUnits = timeUnits.seconds,
        dateCalculationUnit: timeUnits = timeUnits.seconds
    ) {
        super();
        this.arguments = formulaArguments;
        this.operation = operation;
        this.dateResultUnit = dateResultUnit;
        this.dateCalculationUnit = dateCalculationUnit;
    }

    /**
     * Generates a function that can be used in an Array.reduce function as argument to reduce arguments of a calculation
     * @param func The function of the operation that needs to be calculated
     * @private
     * @example ```typescript
     *      const tmp = someDateCalculation.arguments;
     *      const result = tmp.splice(1).reduce(this.dateMath(func), tmp[0]);
     */
    private dateMath(
        func: (x1: number, x2: number) => number
    ): (d1: Date | number, d2: Date | number) => Date | number {
        const operation = this.operation;

        const context = this;

        return function (
            d1: Date | number,
            d2: Date | number
        ): Date | number {
            //If arguments are two dates, calculate the result with the milliseconds of the dates
            if (d1 instanceof Date && d2 instanceof Date) {
                return func(d1.getTime(), d2.getTime());
            }

            //If neither arguments are dates, combine the durations (in ms) by applying the function
            if (!(d1 instanceof Date) && !(d2 instanceof Date)) {
                return func(d1, d2);
            }

            //If neither of the above returned, we now know one must be a date and one a duration, so let's find out which is which
            let date: Date;
            let durationMs: number;
            if (d1 instanceof Date && !(d2 instanceof Date)) {
                date = d1;
                durationMs = d2;
            } else {
                date = <Date>d2;
                durationMs = <number>d1;
            }

            //Add or subtract the duration (in ms) to/from the date using Temporal
            const instant = Temporal.Instant.fromEpochMilliseconds(
                date.getTime()
            );
            switch (operation) {
                case dateOperations.add:
                    return new Date(
                        instant
                            .add({ milliseconds: durationMs })
                            .epochMilliseconds
                    );
                case dateOperations.subtract:
                    return new Date(
                        instant
                            .subtract({ milliseconds: durationMs })
                            .epochMilliseconds
                    );
                default:
                    throw new RulesetError(
                        'Invalid Operation for Dates',
                        context
                    );
            }
        };
    }

    async evaluate(
        data: Record<string, any>
    ): Promise<FormulaResults | Array<FormulaResults>> {
        //Get the function matching our operation
        let tempFunc: (x1: any, x2: any) => number;
        switch (this.operation) {
            case dateOperations.add:
                tempFunc = (x1, x2) => x1 + x2;
                break;
            case dateOperations.subtract:
                tempFunc = (x1, x2) => x1 - x2;
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

        //Map numbers to durations (in milliseconds)
        const tmp = results.map((item) => {
            assertNumberOrDate(item, this);
            if (typeof item === 'number') {
                return item * msPerUnit[this.dateCalculationUnit];
            } else {
                return item;
            }
        });

        //Reduce the array with the dateMath function
        const res = tmp.splice(1).reduce(this.dateMath(func), tmp[0]);
        if (res instanceof Date) {
            return res;
        }
        return (res as number) / msPerUnit[this.dateResultUnit];
    }

    toJsonReady(): Record<string, any> {
        return {
            type: 'dateCalculation',
            operation: this.operation,
            arguments: this.arguments.map(mapArgumentsToJSONReady),
            dateResultUnit: this.dateResultUnit,
            dateCalculationUnit: this.dateCalculationUnit,
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
