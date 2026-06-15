import {
    Calculation,
    mapArgumentsToJSONReady,
    operations,
} from '../../logicElements/Calculation';
import { Atom } from '../../logicElements/Atom';
import { Parser } from '../../index';
import { UsageError } from '../../Errors';

const p = new Parser();

describe('mapArgumentsToJSONReady', () => {
    it('converts a Formula to its JSON-ready form', () => {
        const atom = new Atom('x');
        expect(mapArgumentsToJSONReady(atom)).toEqual({
            type: 'atom',
            path: 'x',
        });
    });

    it('converts a Date to an ISO string', () => {
        const d = new Date('2023-01-01T00:00:00.000Z');
        const result = mapArgumentsToJSONReady(d);
        expect(typeof result).toBe('string');
        expect((result as string).startsWith('2023-01-01')).toBe(true);
    });

    it('passes numbers through unchanged', () => {
        expect(mapArgumentsToJSONReady(42)).toBe(42);
    });

    it('passes strings through unchanged', () => {
        expect(mapArgumentsToJSONReady('hello')).toBe('hello');
    });

    it('passes booleans through unchanged', () => {
        expect(mapArgumentsToJSONReady(true)).toBe(true);
    });
});

describe('Calculation.validate', () => {
    it('returns true when there are at least 2 number arguments', () => {
        const calc = new Calculation([1, 2], operations.add);
        expect(calc.validate()).toBe(true);
    });

    it('returns false when there is only 1 argument', () => {
        const calc = new Calculation([1], operations.add);
        expect(calc.validate()).toBe(false);
    });

    it('returns false when there are no arguments', () => {
        const calc = new Calculation([], operations.add);
        expect(calc.validate()).toBe(false);
    });
});

describe('Calculation.toJsonReady', () => {
    it('returns the correct structure', () => {
        const calc = new Calculation([3, 4], operations.multiply);
        const json = calc.toJsonReady();
        expect(json.type).toBe('calculation');
        expect(json.operation).toBe('multiply');
        expect(json.arguments).toEqual([3, 4]);
    });
});

describe('Calculation edge cases', () => {
    it('throws UsageError on division by zero', async () => {
        const calc = p.parseCalculation({
            type: 'calculation',
            operation: 'divide',
            arguments: [5, 0],
        });
        await expect(calc.evaluate({})).rejects.toThrow(UsageError);
    });

    it('throws UsageError on modulo by zero', async () => {
        const calc = p.parseCalculation({
            type: 'calculation',
            operation: 'modulo',
            arguments: [7, 0],
        });
        await expect(calc.evaluate({})).rejects.toThrow(UsageError);
    });

    it('throws UsageError when a Date is used as argument', async () => {
        const calc = p.parseCalculation({
            type: 'calculation',
            operation: 'add',
            arguments: [
                1,
                // Sneak a date in by wrapping it in an atom that evaluates to a Date
                {
                    type: 'atom',
                    path: 'dateVal',
                    isDate: true,
                },
            ],
        });
        await expect(calc.evaluate({ dateVal: '2023-01-01' })).rejects.toThrow(
            UsageError
        );
    });

    it('correctly handles floating point addition', async () => {
        const calc = p.parseCalculation({
            type: 'calculation',
            operation: 'add',
            arguments: [0.1, 0.2],
        });
        // Should not produce 0.30000000000000004 due to rounding
        expect(await calc.evaluate({})).toBeCloseTo(0.3, 10);
    });

    it('reduces more than 2 arguments left to right', async () => {
        // 10 - 3 - 2 = 5
        const calc = p.parseCalculation({
            type: 'calculation',
            operation: 'subtract',
            arguments: [10, 3, 2],
        });
        expect(await calc.evaluate({})).toBe(5);
    });
});
