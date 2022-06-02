import { evaluateAll, Parser } from '../../src';
// @ts-ignore
import { exampleData, ruleTemplate } from '../assets/exampleData';
// @ts-ignore
import mathExample from '../assets/exampleMath.json';

const p = new Parser();
it('equals', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'comparison',
            operation: 'equal',
            arguments: [4, 4],
        },
    });
    expect(rule.evaluate({})).toBe(true);
});

it('name equals Julian', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'comparison',
            operation: 'equal',
            arguments: [
                'Julian',
                {
                    type: 'atom',
                    path: 'name',
                },
            ],
        },
    });
    expect(rule.evaluate(exampleData)).toBe(true);
});

it('birthday before 27.02.2002', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'comparison',
            operation: 'smaller',
            arguments: [
                {
                    type: 'atom',
                    path: 'dateOfBirth',
                },
                '2002-02-27',
            ],
        },
    });
    expect(rule.evaluate(exampleData)).toBe(true);
});

it('-3 < -1', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'comparison',
            operation: 'smaller',
            arguments: [-3, -1],
        },
    });
    expect(rule.evaluate(exampleData)).toBe(true);
});

it('-3 < 1', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'comparison',
            operation: 'smaller',
            arguments: [-3, 1],
        },
    });
    expect(rule.evaluate(exampleData)).toBe(true);
});

it('-3 < 4', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'comparison',
            operation: 'smaller',
            arguments: [-3, 4],
        },
    });
    expect(rule.evaluate(exampleData)).toBe(true);
});

it('birthday before 27.02.2002, but other birthday', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'comparison',
            operation: 'smaller',
            arguments: ['2003-02-28', '2002-02-27'],
        },
    });
    expect(rule.evaluate(exampleData)).toBe(false);
});

it('run math example', () => {
    const ruleset = p.parseRuleSet(mathExample);
    expect(evaluateAll(ruleset, exampleData).result).toBe(true);
});
