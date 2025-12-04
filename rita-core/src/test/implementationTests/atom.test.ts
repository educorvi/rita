import { Parser } from '../../index';
import { exampleData, ruleTemplate } from '../assets/exampleData';
import ruleset_defaultVal from '../assets/defaultVal.json';

const p = new Parser();

it('isMember', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'atom',
            path: 'member',
        },
    });
    expect(rule.evaluate(exampleData)).resolves.toBe(true);
});
it('isNotEmployee', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'atom',
            path: 'employee',
        },
    });
    expect(rule.evaluate(exampleData)).resolves.toBe(false);
});
it('nestedAtom', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'atom',
            path: 'visit.paymentDetails.payed',
        },
    });
    expect(rule.evaluate(exampleData)).resolves.toBe(true);
});
it('second customer rated', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'atom',
            path: 'customers[1].rated',
        },
    });
    expect(rule.evaluate(exampleData)).resolves.toBe(true);
});
it('use default value', () => {
    const rule = p.parseRuleSet(ruleset_defaultVal)[0];
    expect(rule.evaluate({})).resolves.toBe(true);
});
it('do not use default value when value is specified', () => {
    const rule = p.parseRuleSet(ruleset_defaultVal)[0];
    expect(rule.evaluate({ fancyness: 'very' })).resolves.toBe(false);
});
