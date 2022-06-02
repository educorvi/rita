// @ts-ignore
import { exampleData, ruleTemplate } from '../../assets/exampleData';
import { Parser } from '../../../src';

const p = new Parser();

it('!member', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'not',
            arguments: [
                {
                    type: 'atom',
                    path: 'member',
                },
            ],
        },
    });
    expect(rule.evaluate(exampleData)).toBe(false);
});
it('member  employee', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'not',
            arguments: [
                {
                    type: 'atom',
                    path: 'member',
                },
                {
                    type: 'atom',
                    path: 'employee',
                },
            ],
        },
    });
    expect(() => rule.evaluate(exampleData)).toThrow();
});
