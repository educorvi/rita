import { Rule } from '../../logicElements/Rule';
import { Comparison, comparisons } from '../../logicElements/Comparison';
import { evaluateAll, Parser } from '../../index';
import { UnimplementedError, UsageError } from '../../Errors';
import { Plugin } from '../../logicElements/Plugin';
import { Formula } from '../../logicElements/Formula';

const p = new Parser();

// ─── Rule ────────────────────────────────────────────────────────────────────

describe('Rule', () => {
    const trueFormula = new Comparison([1, 1], comparisons.equal);
    const falseFormula = new Comparison([1, 2], comparisons.equal);

    it('defaults comment to empty string', () => {
        const rule = new Rule('r1', trueFormula);
        expect(rule.comment).toBe('');
    });

    it('stores the provided comment', () => {
        const rule = new Rule('r1', trueFormula, 'my comment');
        expect(rule.comment).toBe('my comment');
    });

    it('toJsonReady includes id, rule, and comment', () => {
        const rule = new Rule('r1', trueFormula, 'hello');
        const json = rule.toJsonReady();
        expect(json.id).toBe('r1');
        expect(json.comment).toBe('hello');
        expect(json.rule).toBeDefined();
    });

    it('evaluate delegates to the inner formula', async () => {
        const ruleTrue = new Rule('t', trueFormula);
        const ruleFalse = new Rule('f', falseFormula);
        expect(await ruleTrue.evaluate({})).toBe(true);
        expect(await ruleFalse.evaluate({})).toBe(false);
    });
});

// ─── evaluateAll ─────────────────────────────────────────────────────────────

describe('evaluateAll', () => {
    it('returns result: true and counts 0/0 for empty ruleset', async () => {
        const result = await evaluateAll([], {});
        expect(result.result).toBe(true);
        expect(result.counts.true).toBe(0);
        expect(result.counts.false).toBe(0);
        expect(result.details).toHaveLength(0);
    });

    it('counts correctly when all rules pass', async () => {
        const rules = [
            new Rule('a', new Comparison([1, 1], comparisons.equal)),
            new Rule('b', new Comparison([2, 2], comparisons.equal)),
        ];
        const result = await evaluateAll(rules, {});
        expect(result.result).toBe(true);
        expect(result.counts.true).toBe(2);
        expect(result.counts.false).toBe(0);
    });

    it('counts correctly when some rules fail', async () => {
        const rules = [
            new Rule('pass', new Comparison([1, 1], comparisons.equal)),
            new Rule('fail', new Comparison([1, 2], comparisons.equal)),
        ];
        const result = await evaluateAll(rules, {});
        expect(result.result).toBe(false);
        expect(result.counts.true).toBe(1);
        expect(result.counts.false).toBe(1);
        expect(result.details[0]).toEqual({ id: 'pass', result: true });
        expect(result.details[1]).toEqual({ id: 'fail', result: false });
    });
});

// ─── Parser - unknown type ────────────────────────────────────────────────────

describe('Parser.parseFormula - unknown type', () => {
    it('throws UnimplementedError for an unknown formula type', () => {
        expect(() => p.parseFormula({ type: 'unknownType42' })).toThrow(
            UnimplementedError
        );
    });
});

// ─── Parser - invalid date in comparison params ───────────────────────────────

describe('Parser.parseComparison - invalid date', () => {
    it('throws UsageError when a date string cannot be parsed', () => {
        expect(() =>
            p.parseComparison({
                type: 'comparison',
                operation: 'equal',
                dates: true,
                arguments: ['not-a-date', '2023-01-01'],
            })
        ).toThrow(UsageError);
    });
});

// ─── Parser - unregistered plugin ────────────────────────────────────────────

describe('Parser.parsePlugin - unregistered plugin', () => {
    it('throws UsageError when the plugin name is not registered', () => {
        expect(() =>
            p.parsePlugin({
                type: 'plugin',
                name: 'nonExistentPlugin',
                options: {},
                formula: {
                    type: 'comparison',
                    operation: 'equal',
                    arguments: [1, 1],
                },
            })
        ).toThrow(UsageError);
    });
});

// ─── Plugin - no formula ──────────────────────────────────────────────────────

describe('Plugin - no formula', () => {
    class MinimalPlugin extends Plugin {
        enrichData(data: Record<string, any>): Promise<Record<string, any>> {
            return Promise.resolve(data);
        }
        getName(): string {
            return 'minimal-plugin';
        }
        getVersion(): string {
            return '1.0.0';
        }
    }

    it('evaluate throws UsageError when formula is undefined', async () => {
        const plugin = new MinimalPlugin({}, undefined);
        await expect(plugin.evaluate({})).rejects.toThrow(UsageError);
    });

    it('validate throws UsageError when formula is undefined', () => {
        const plugin = new MinimalPlugin({}, undefined);
        expect(() => plugin.validate()).toThrow(UsageError);
    });
});
