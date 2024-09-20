/**
 * Mathematical operations
 */
import { Formula, FormulaResults } from './Formula';
import { Atom } from './Atom';
import { Calculation, mapArgumentsToJSONReady } from './Calculation';
import { RulesetError } from '../Errors';
import { assertNumberOrDate } from '../Assertions';
import { DateTime, Duration } from 'luxon';

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
    ): (d1: Date | Duration, d2: Date | Duration) => Date | Duration {
        const operation = this.operation;

        const context = this;

        return function (
            d1: Date | Duration,
            d2: Date | Duration
        ): Date | Duration {
            //If arguments are two dates, calculate the result with the milliseconds of the dates
            if (d1 instanceof Date && d2 instanceof Date) {
                return Duration.fromMillis(func(d1.getTime(), d2.getTime()), {
                    conversionAccuracy: 'longterm',
                });
            }

            //If neither arguments are dates, combine the durations by applying the function to their millisecond values
            if (!(d1 instanceof Date) && !(d2 instanceof Date)) {
                return Duration.fromMillis(func(d1.toMillis(), d2.toMillis()), {
                    conversionAccuracy: 'longterm',
                });
            }

            //If neither of the above returned, we now know one must be a date and one a duration, so let's find out which is which
            let date: Date;
            let duration: Duration;
            if (d1 instanceof Date && !(d2 instanceof Date)) {
                date = d1;
                duration = <Duration>d2;
            } else {
                date = <Date>d2;
                duration = <Duration>d1;
            }

            //Add or subtract the duration to/from the date
            const lDate: DateTime = DateTime.fromJSDate(date);
            switch (operation) {
                case dateOperations.add:
                    return lDate.plus(duration).toJSDate();
                case dateOperations.subtract:
                    return lDate.minus(duration).toJSDate();
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

        //Map numbers to durations
        const tmp = results.map((item) => {
            assertNumberOrDate(item, this);
            if (typeof item === 'number') {
                return Duration.fromObject(
                    {
                        [this.dateCalculationUnit]: item,
                    },
                    { conversionAccuracy: 'longterm' }
                );
            } else {
                return item;
            }
        });

        //Reduce the array with the dateMath function
        const res = tmp.splice(1).reduce(this.dateMath(func), tmp[0]);
        if (res instanceof Date) {
            return res;
        }
        return res.as(this.dateResultUnit);
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
