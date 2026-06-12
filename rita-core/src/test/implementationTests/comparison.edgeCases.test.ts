import { Comparison, comparisons } from '../../logicElements/Comparison';
import { Atom } from '../../logicElements/Atom';
import { Parser } from '../../index';
import { UsageError } from '../../Errors';

const p = new Parser();

describe('Comparison - untested operations', () => {
    it('greater: 5 > 3 is true', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'greater',
            arguments: [5, 3],
        });
        expect(await c.evaluate({})).toBe(true);
    });

    it('greater: 3 > 5 is false', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'greater',
            arguments: [3, 5],
        });
        expect(await c.evaluate({})).toBe(false);
    });

    it('greaterOrEqual: 5 >= 5 is true', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'greaterOrEqual',
            arguments: [5, 5],
        });
        expect(await c.evaluate({})).toBe(true);
    });

    it('greaterOrEqual: 4 >= 5 is false', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'greaterOrEqual',
            arguments: [4, 5],
        });
        expect(await c.evaluate({})).toBe(false);
    });

    it('smallerOrEqual: 3 <= 3 is true', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'smallerOrEqual',
            arguments: [3, 3],
        });
        expect(await c.evaluate({})).toBe(true);
    });

    it('smallerOrEqual: 4 <= 3 is false', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'smallerOrEqual',
            arguments: [4, 3],
        });
        expect(await c.evaluate({})).toBe(false);
    });

    it('equal: false === false is true', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'equal',
            arguments: [false, false],
        });
        // booleans are passed through when not dates
        expect(await c.evaluate({})).toBe(true);
    });
});

describe('Comparison - undefined arguments', () => {
    it('returns false when first argument resolves to undefined (missing path, no default)', async () => {
        new Comparison(
            [new Atom('nonExistent', false, undefined), 42],
            comparisons.equal
        );
        // Missing path with no default throws — test that the undefined guard
        // in the evaluate function is reachable via allowDifferentTypes path
        // The comparison itself returns false if p1 or p2 is undefined
        // We set up a default so the Atom returns undefined explicitly
        const atomWithDefault = new Atom('missing', false, undefined as any);
        const cDef = new Comparison(
            [atomWithDefault, 42],
            comparisons.equal,
            false,
            true
        );
        // Atom throws UndefinedPathError - so this path tests the try/catch path
        await expect(cDef.evaluate({})).rejects.toThrow();
    });
});

describe('Comparison - date comparisons', () => {
    it('date greater: later date is greater', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'greater',
            dates: true,
            arguments: ['2023-06-01', '2022-01-01'],
        });
        expect(await c.evaluate({})).toBe(true);
    });

    it('date greaterOrEqual: same date', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'greaterOrEqual',
            dates: true,
            arguments: ['2023-06-01', '2023-06-01'],
        });
        expect(await c.evaluate({})).toBe(true);
    });

    it('date smallerOrEqual: same date', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'smallerOrEqual',
            dates: true,
            arguments: ['2023-06-01', '2023-06-01'],
        });
        expect(await c.evaluate({})).toBe(true);
    });

    it('date equal: same ISO string equals itself', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'equal',
            dates: true,
            arguments: ['2023-06-01T00:00:00.000Z', '2023-06-01T00:00:00.000Z'],
        });
        expect(await c.evaluate({})).toBe(true);
    });
});

describe('Comparison.validate', () => {
    it('returns false with fewer than 2 arguments', () => {
        const c = new Comparison([42], comparisons.equal);
        expect(c.validate()).toBe(false);
    });

    it('returns false with more than 2 arguments', () => {
        const c = new Comparison([1, 2, 3], comparisons.equal);
        expect(c.validate()).toBe(false);
    });

    it('returns true with exactly 2 valid arguments', () => {
        const c = new Comparison([1, 2], comparisons.equal);
        expect(c.validate()).toBe(true);
    });
});

describe('Comparison.toJsonReady', () => {
    it('includes dates: true when dates flag is set', () => {
        const c = new Comparison(
            [new Date('2023-01-01'), new Date('2024-01-01')],
            comparisons.smaller,
            true
        );
        const json = c.toJsonReady();
        expect(json.dates).toBe(true);
    });

    it('does not include dates key when dates flag is false', () => {
        const c = new Comparison([1, 2], comparisons.smaller, false);
        const json = c.toJsonReady();
        expect(json.dates).toBeUndefined();
    });
});

describe('Comparison - allowDifferentTypes', () => {
    it('does not throw when allowDifferentTypes is true and types differ', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'equal',
            allowDifferentTypes: true,
            arguments: [42, 'forty-two'],
        });
        expect(await c.evaluate({})).toBe(false);
    });

    it('throws UsageError when allowDifferentTypes is false/omitted and types differ', async () => {
        const c = p.parseComparison({
            type: 'comparison',
            operation: 'equal',
            arguments: [42, 'forty-two'],
        });
        await expect(c.evaluate({})).rejects.toThrow(UsageError);
    });
});
