import { Parser } from '../../src';
// @ts-ignore
import { exampleData, ruleTemplate } from '../assets/exampleData';

const p = new Parser();

it('isMember', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'atom',
            path: 'member',
        },
    });
    expect(rule.evaluate(exampleData)).toBe(true);
});
it('isNotEmployee', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'atom',
            path: 'employee',
        },
    });
    expect(rule.evaluate(exampleData)).toBe(false);
});
it('nestedAtom', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'atom',
            path: 'visit.paymentDetails.payed',
        },
    });
    expect(rule.evaluate(exampleData)).toBe(true);
});
it('second customer rated', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'atom',
            path: 'customers[1].rated',
        },
    });
    expect(rule.evaluate(exampleData)).toBe(true);
});
