import { Quantifier } from '../../logicElements/Quantifier';
import { Atom } from '../../logicElements/Atom';
import { Comparison, comparisons } from '../../logicElements/Comparison';
import { Parser } from '../../index';
import { UsageError } from '../../Errors';

const p = new Parser();

// A comparison that checks whether the placeholder value equals true
function placeholderIsTrue(placeholder: string) {
    return new Comparison(
        [new Atom(placeholder), true],
        comparisons.equal,
        false,
        true
    );
}

describe('Quantifier - empty array', () => {
    it('forall over empty array returns true (vacuous truth)', async () => {
        const q = new Quantifier(
            'forall',
            new Atom('items'),
            'item',
            'index',
            placeholderIsTrue('item')
        );
        expect(await q.evaluate({ items: [] })).toBe(true);
    });

    it('exists over empty array returns false', async () => {
        const q = new Quantifier(
            'exists',
            new Atom('items'),
            'item',
            'index',
            placeholderIsTrue('item')
        );
        expect(await q.evaluate({ items: [] })).toBe(false);
    });
});

describe('Quantifier - non-array from Atom', () => {
    it('throws UsageError when atom resolves to a non-array', async () => {
        const q = new Quantifier(
            'forall',
            new Atom('notAnArray'),
            'item',
            'index',
            placeholderIsTrue('item')
        );
        await expect(q.evaluate({ notAnArray: 42 })).rejects.toThrow(
            UsageError
        );
    });

    it('throws UsageError when atom resolves to a string', async () => {
        const q = new Quantifier(
            'exists',
            new Atom('notAnArray'),
            'item',
            'index',
            placeholderIsTrue('item')
        );
        await expect(q.evaluate({ notAnArray: 'hello' })).rejects.toThrow(
            UsageError
        );
    });
});

describe('Quantifier - validate', () => {
    it('returns false when placeholder is empty string', () => {
        const q = new Quantifier(
            'forall',
            new Atom('items'),
            '',
            'index',
            placeholderIsTrue('')
        );
        expect(q.validate()).toBe(false);
    });

    it('returns true when placeholder is non-empty and array atom is valid', () => {
        const q = new Quantifier(
            'forall',
            new Atom('items'),
            'item',
            'index',
            placeholderIsTrue('item')
        );
        expect(q.validate()).toBe(true);
    });

    it('validates properly for array-of-formulas variant', () => {
        const q = new Quantifier(
            'exists',
            [new Comparison([1, 1], comparisons.equal)],
            'item',
            'index',
            placeholderIsTrue('item')
        );
        expect(q.validate()).toBe(true);
    });
});

describe('Quantifier - inline array of formulas', () => {
    it('forall over inline formula array where all evaluate true', async () => {
        // The array itself is a list of formulas that each evaluate to booleans
        const q = p.parseQuantifier({
            type: 'forall',
            array: [
                { type: 'comparison', operation: 'equal', arguments: [1, 1] },
                { type: 'comparison', operation: 'equal', arguments: [2, 2] },
            ],
            placeholder: 'item',
            rule: {
                type: 'atom',
                path: 'item',
            },
        });
        expect(await q.evaluate({})).toBe(true);
    });

    it('exists over inline formula array with one true', async () => {
        const q = p.parseQuantifier({
            type: 'exists',
            array: [
                { type: 'comparison', operation: 'equal', arguments: [1, 2] },
                { type: 'comparison', operation: 'equal', arguments: [3, 3] },
            ],
            placeholder: 'item',
            rule: {
                type: 'atom',
                path: 'item',
            },
        });
        expect(await q.evaluate({})).toBe(true);
    });
});

describe('Quantifier - index placeholder', () => {
    it('index starts at 0 for the first element', async () => {
        // forall: element at index 0 must be the index itself (i.e., 0)
        const q = p.parseQuantifier({
            type: 'exists',
            array: {
                type: 'atom',
                path: 'items',
            },
            placeholder: 'item',
            indexPlaceholder: 'idx',
            rule: {
                type: 'comparison',
                operation: 'equal',
                arguments: [{ type: 'atom', path: 'idx' }, 0],
            },
        });
        expect(await q.evaluate({ items: ['a', 'b', 'c'] })).toBe(true);
    });
});

describe('Quantifier - toJsonReady', () => {
    it('returns correct structure for atom array', () => {
        const q = new Quantifier(
            'forall',
            new Atom('items'),
            'item',
            'index',
            new Comparison([1, 1], comparisons.equal)
        );
        const json = q.toJsonReady();
        expect(json.type).toBe('forall');
        expect(json.placeholder).toBe('item');
        expect(json.array).toHaveProperty('type', 'atom');
    });
});
