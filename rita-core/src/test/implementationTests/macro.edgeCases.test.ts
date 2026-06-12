import { Macro } from '../../logicElements/Macro';
import { Atom } from '../../logicElements/Atom';
import { Parser } from '../../index';
import { HasNoLengthError } from '../../Errors';

const p = new Parser();

describe('Macro.validate', () => {
    it('returns true for now macro (no array needed)', () => {
        const m = new Macro('now');
        expect(m.validate()).toBe(true);
    });

    it('returns false for length macro without an array', () => {
        const m = new Macro('length', undefined);
        expect(m.validate()).toBe(false);
    });

    it('returns true for length macro with an array atom', () => {
        const m = new Macro('length', new Atom('items'));
        expect(m.validate()).toBe(true);
    });
});

describe('Macro.toJsonReady', () => {
    it('now macro has correct structure', () => {
        const m = new Macro('now');
        const json = m.toJsonReady();
        expect(json.type).toBe('macro');
        expect(json.macro.type).toBe('now');
        expect(json.macro.array).toBeUndefined();
    });

    it('length macro references its array atom', () => {
        const m = new Macro('length', new Atom('items'));
        const json = m.toJsonReady();
        expect(json.type).toBe('macro');
        expect(json.macro.type).toBe('length');
        expect(json.macro.array).toEqual({ type: 'atom', path: 'items' });
    });
});

describe('Macro.evaluate - length edge cases', () => {
    it('throws HasNoLengthError when atom resolves to a number', async () => {
        const m = p.parseMacro({
            type: 'macro',
            macro: {
                type: 'length',
                array: { type: 'atom', path: 'val' },
            },
        });
        await expect(m.evaluate({ val: 42 })).rejects.toThrow(HasNoLengthError);
    });

    it('throws HasNoLengthError when atom resolves to a boolean', async () => {
        const m = p.parseMacro({
            type: 'macro',
            macro: {
                type: 'length',
                array: { type: 'atom', path: 'val' },
            },
        });
        await expect(m.evaluate({ val: true })).rejects.toThrow(
            HasNoLengthError
        );
    });

    it('throws HasNoLengthError when atom resolves to null', async () => {
        const m = p.parseMacro({
            type: 'macro',
            macro: {
                type: 'length',
                array: { type: 'atom', path: 'val', default: null },
            },
        });
        await expect(m.evaluate({ val: null })).rejects.toThrow(
            HasNoLengthError
        );
    });

    it('returns 0 for an empty array', async () => {
        const m = p.parseMacro({
            type: 'macro',
            macro: {
                type: 'length',
                array: { type: 'atom', path: 'items' },
            },
        });
        expect(await m.evaluate({ items: [] })).toBe(0);
    });

    it('returns correct length for object with length property', async () => {
        // Objects with a length property are array-like
        const m = p.parseMacro({
            type: 'macro',
            macro: {
                type: 'length',
                array: { type: 'atom', path: 'items' },
            },
        });
        expect(await m.evaluate({ items: { length: 5 } })).toBe(5);
    });
});

describe('Macro.evaluate - now', () => {
    it('returns a Date that is roughly the current time', async () => {
        const before = Date.now();
        const m = new Macro('now');
        const result = await m.evaluate({});
        const after = Date.now();
        expect(result).toBeInstanceOf(Date);
        expect((result as Date).getTime()).toBeGreaterThanOrEqual(before);
        expect((result as Date).getTime()).toBeLessThanOrEqual(after + 100);
    });
});
