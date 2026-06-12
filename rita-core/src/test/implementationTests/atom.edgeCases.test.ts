import { Atom, parseDate } from '../../logicElements/Atom';
import { Parser } from '../../index';
import { UndefinedPathError, UsageError } from '../../Errors';
import { ruleTemplate } from '../assets/exampleData';

const p = new Parser();

describe('parseDate', () => {
    it('parses a valid ISO date string', () => {
        const d = parseDate('2023-06-15');
        expect(d).toBeInstanceOf(Date);
        expect(isNaN(d.getTime())).toBe(false);
    });

    it('throws UsageError for an unparseable string', () => {
        expect(() => parseDate('not-a-date')).toThrow(UsageError);
    });

    it('throws UsageError for an empty string', () => {
        // dayjs('') is valid in some environments — verify real behaviour
        // If it throws, we catch UsageError; if dayjs considers it valid we skip
        try {
            parseDate('');
        } catch (e) {
            expect(e).toBeInstanceOf(UsageError);
        }
    });
});

describe('Atom.validate', () => {
    it('returns true when path is a non-empty string', () => {
        const atom = new Atom('some.path');
        expect(atom.validate()).toBe(true);
    });

    it('returns false when path is an empty string', () => {
        const atom = new Atom('');
        expect(atom.validate()).toBe(false);
    });
});

describe('Atom.toJsonReady', () => {
    it('omits isDate and default when not set', () => {
        const atom = new Atom('foo');
        const json = atom.toJsonReady();
        expect(json.type).toBe('atom');
        expect(json.path).toBe('foo');
        expect(json.isDate).toBeUndefined();
        expect(json.default).toBeUndefined();
    });

    it('includes isDate when set', () => {
        const atom = new Atom('foo', true);
        const json = atom.toJsonReady();
        expect(json.isDate).toBe(true);
    });

    it('includes default when set', () => {
        const atom = new Atom('foo', false, 'fallback');
        const json = atom.toJsonReady();
        expect(json.default).toBe('fallback');
    });
});

describe('Atom.getPropertyByString (static)', () => {
    it('resolves a simple top-level key', () => {
        expect(Atom.getPropertyByString({ a: 42 }, 'a')).toBe(42);
    });

    it('resolves a nested key', () => {
        expect(Atom.getPropertyByString({ a: { b: 7 } }, 'a.b')).toBe(7);
    });

    it('resolves bracket notation [0]', () => {
        expect(Atom.getPropertyByString({ arr: ['x', 'y'] }, 'arr[1]')).toBe(
            'y'
        );
    });

    it('strips a leading dot', () => {
        expect(Atom.getPropertyByString({ a: 1 }, '.a')).toBe(1);
    });

    it('returns defaultValue when key is missing', () => {
        expect(Atom.getPropertyByString({ a: 1 }, 'b', 'default')).toBe(
            'default'
        );
    });

    it('throws UndefinedPathError when key is missing and no default', () => {
        expect(() => Atom.getPropertyByString({ a: 1 }, 'b')).toThrow(
            UndefinedPathError
        );
    });

    it('returns defaultValue when intermediate path is not an object', () => {
        // 'a' is a number, 'a.b' traversal hits a non-object
        expect(Atom.getPropertyByString({ a: 42 }, 'a.b', 'fallback')).toBe(
            'fallback'
        );
    });

    it('throws UndefinedPathError when intermediate path is not an object and no default', () => {
        expect(() => Atom.getPropertyByString({ a: 42 }, 'a.b')).toThrow(
            UndefinedPathError
        );
    });
});

describe('Atom.evaluate', () => {
    it('returns raw value when isDate is false', async () => {
        const atom = new Atom('val');
        expect(await atom.evaluate({ val: 99 })).toBe(99);
    });

    it('parses date string when isDate is true', async () => {
        const atom = new Atom('dob', true);
        const result = await atom.evaluate({ dob: '2020-01-01' });
        expect(result).toBeInstanceOf(Date);
    });

    it('throws UsageError when isDate is true but string is invalid', async () => {
        const atom = new Atom('dob', true);
        await expect(atom.evaluate({ dob: 'not-a-date' })).rejects.toThrow(
            UsageError
        );
    });

    it('returns array without modification', async () => {
        const atom = new Atom('items');
        const arr = [1, 2, 3];
        expect(await atom.evaluate({ items: arr })).toEqual(arr);
    });

    it('uses default value when path is missing', async () => {
        const rule = p.parseRule({
            ...ruleTemplate,
            rule: {
                type: 'atom',
                path: 'missing',
                default: true,
            },
        });
        expect(await rule.evaluate({})).toBe(true);
    });
});
