import {
    DateCalculation,
    dateOperations,
} from '../../logicElements/DateCalculation';
import { Parser } from '../../index';
import { NotNumberOrDateError } from '../../Errors';

const p = new Parser();

describe('DateCalculation.validate', () => {
    it('returns false when fewer than 2 arguments', () => {
        const dc = new DateCalculation([new Date()], dateOperations.add);
        expect(dc.validate()).toBe(false);
    });

    it('returns false when no arguments', () => {
        const dc = new DateCalculation([], dateOperations.subtract);
        expect(dc.validate()).toBe(false);
    });

    it('returns true with at least 2 arguments', () => {
        const dc = new DateCalculation([1, 2], dateOperations.add);
        expect(dc.validate()).toBe(true);
    });
});

describe('DateCalculation.toJsonReady', () => {
    it('has correct structure', () => {
        const dc = new DateCalculation(
            [1, 2],
            dateOperations.add,
            'days' as any,
            'hours' as any
        );
        const json = dc.toJsonReady();
        expect(json.type).toBe('dateCalculation');
        expect(json.operation).toBe('add');
        expect(json.dateResultUnit).toBe('days');
        expect(json.dateCalculationUnit).toBe('hours');
    });
});

describe('DateCalculation - two durations', () => {
    it('add two durations (numbers) returns numeric result', async () => {
        // 60s + 60s = 120s
        const calc = p.parseDateCalculation({
            type: 'dateCalculation',
            operation: 'add',
            dateCalculationUnit: 'seconds',
            dateResultUnit: 'seconds',
            arguments: [60, 60],
        });
        expect(await calc.evaluate({})).toBeCloseTo(120, 5);
    });

    it('subtract two durations (numbers) returns numeric result', async () => {
        // 120s - 60s = 60s
        const calc = p.parseDateCalculation({
            type: 'dateCalculation',
            operation: 'subtract',
            dateCalculationUnit: 'seconds',
            dateResultUnit: 'seconds',
            arguments: [120, 60],
        });
        expect(await calc.evaluate({})).toBeCloseTo(60, 5);
    });
});

describe('DateCalculation - non-number/non-date argument', () => {
    it('throws NotNumberOrDateError when an argument evaluates to a string', async () => {
        const calc = p.parseDateCalculation({
            type: 'dateCalculation',
            operation: 'add',
            dateCalculationUnit: 'days',
            dateResultUnit: 'days',
            arguments: [
                {
                    type: 'atom',
                    path: 'stringVal',
                    // not isDate, so evaluates to a plain string
                },
                1,
            ],
        });
        await expect(
            calc.evaluate({ stringVal: 'not-a-number' })
        ).rejects.toThrow(NotNumberOrDateError);
    });

    it('throws NotNumberOrDateError when an argument evaluates to a boolean', async () => {
        const calc = p.parseDateCalculation({
            type: 'dateCalculation',
            operation: 'add',
            dateCalculationUnit: 'days',
            dateResultUnit: 'days',
            arguments: [
                {
                    type: 'atom',
                    path: 'boolVal',
                },
                1,
            ],
        });
        await expect(calc.evaluate({ boolVal: true })).rejects.toThrow(
            NotNumberOrDateError
        );
    });
});

describe('DateCalculation - date result units', () => {
    it('returns result in hours', async () => {
        // 2 hours - 1 hour = 1 hour
        const calc = p.parseDateCalculation({
            type: 'dateCalculation',
            operation: 'subtract',
            dateCalculationUnit: 'hours',
            dateResultUnit: 'hours',
            arguments: [2, 1],
        });
        expect(await calc.evaluate({})).toBeCloseTo(1, 5);
    });

    it('returns result in minutes', async () => {
        const calc = p.parseDateCalculation({
            type: 'dateCalculation',
            operation: 'add',
            dateCalculationUnit: 'minutes',
            dateResultUnit: 'minutes',
            arguments: [10, 5],
        });
        expect(await calc.evaluate({})).toBeCloseTo(15, 5);
    });

    it('returns result in years between two dates', async () => {
        const calc = p.parseDateCalculation({
            type: 'dateCalculation',
            operation: 'subtract',
            dateResultUnit: 'years',
            arguments: ['2023-01-01', '2020-01-01'],
        });
        expect(await calc.evaluate({})).toBeCloseTo(3, 1);
    });
});
