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
    expect(rule.evaluate(exampleData)).resolves.toBe(false);
});
it('!!member', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'not',
            arguments: [
                {
                    type: 'not',
                    arguments: [
                        {
                            type: 'atom',
                            path: 'member',
                        },
                    ],
                },
            ],
        },
    });
    expect(rule.evaluate(exampleData)).resolves.toBe(true);
});
