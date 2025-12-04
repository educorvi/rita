import exampleRule from '../assets/example1.json';
import { exampleData } from '../assets/exampleData';
import { evaluateAll, Parser } from '../../src';

const p = new Parser();

it('rule1 should be true', () => {
    expect(p.parseRuleSet(exampleRule)[0].evaluate(exampleData)).resolves.toBe(
        true
    );
});

it('rule2 should be false', () => {
    expect(p.parseRuleSet(exampleRule)[1].evaluate(exampleData)).resolves.toBe(
        false
    );
});

it('all combined should be false', async () => {
    const results = await evaluateAll(p.parseRuleSet(exampleRule), exampleData);
    expect(results.result).toBe(false);
});
