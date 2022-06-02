import exampleRule from '../assets/example1.json';
// @ts-ignore
import { exampleData } from '../assets/exampleData';
import { evaluateAll, Parser } from '../../src';

const p = new Parser();

it('rule1 should be true', () => {
    expect(p.parseRuleSet(exampleRule)[0].evaluate(exampleData)).toBe(true);
});

it('rule2 should be false', () => {
    expect(p.parseRuleSet(exampleRule)[1].evaluate(exampleData)).toBe(false);
});

it('all combined should be false', () => {
    const results = evaluateAll(p.parseRuleSet(exampleRule), exampleData);
    expect(results.result).toBe(false);
});
