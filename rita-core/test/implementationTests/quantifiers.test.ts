import { Parser } from '../../src';

// @ts-ignore
import rule_qfa from '../assets/quantifiers_fa.json';
// @ts-ignore
import rule_qex from '../assets/quantifiers_ex.json';
import { evaluateAll } from '../../src';
import { UsageError } from '../../src';

const p = new Parser();

describe('forall', () => {
    const ruleset = p.parseRuleSet(rule_qfa);
    it('missing single values', () => {
        expect(() =>
            evaluateAll(ruleset, {
                arraydata: [true, true, true, true],
            })
        ).rejects.toThrow(UsageError);
    });
    it('all true', async () => {
        const val1 = true;
        const val2 = true;
        const val3 = true;
        const res = await evaluateAll(ruleset, {
            val1,
            val2,
            val3,
            arraydata: [val1, val2, val3],
        });
        res.details.forEach((it) => expect(it.result).toBe(true));
    });
    it('one false', async () => {
        const val1 = true;
        const val2 = false;
        const val3 = true;
        const res = await evaluateAll(ruleset, {
            val1,
            val2,
            val3,
            arraydata: [val1, val2, val3],
        });
        res.details.forEach((it) => expect(it.result).toBe(false));
    });
    it('all false', async () => {
        const val1 = false;
        const val2 = false;
        const val3 = false;
        const res = await evaluateAll(ruleset, {
            val1,
            val2,
            val3,
            arraydata: [val1, val2, val3],
        });
        res.details.forEach((it) => expect(it.result).toBe(false));
    });
});
describe('exists', () => {
    const ruleset = p.parseRuleSet(rule_qex);
    it('missing single values', () => {
        expect(() =>
            evaluateAll(ruleset, {
                arraydata: [true, true, true, true],
            })
        ).rejects.toThrow(UsageError);
    });
    it('all true', async () => {
        const val1 = true;
        const val2 = true;
        const val3 = true;
        const res = await evaluateAll(ruleset, {
            val1,
            val2,
            val3,
            arraydata: [val1, val2, val3],
        });
        res.details.forEach((it) => expect(it.result).toBe(true));
    });
    it('two false', async () => {
        const val1 = false;
        const val2 = false;
        const val3 = true;
        const res = await evaluateAll(ruleset, {
            val1,
            val2,
            val3,
            arraydata: [val1, val2, val3],
        });
        res.details.forEach((it) => expect(it.result).toBe(true));
    });
    it('all false', async () => {
        const val1 = false;
        const val2 = false;
        const val3 = false;
        const res = await evaluateAll(ruleset, {
            val1,
            val2,
            val3,
            arraydata: [val1, val2, val3],
        });
        res.details.forEach((it) => expect(it.result).toBe(false));
    });
});
