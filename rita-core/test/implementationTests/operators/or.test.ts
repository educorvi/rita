import { Parser } from '../../../src';
import { exampleData, ruleTemplate } from '../../assets/exampleData';

const p = new Parser();

it('member || employee', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'or',
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
    expect(rule.evaluate(exampleData)).resolves.toBe(true);
});
it('customers[0].rated || employee', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'or',
            arguments: [
                {
                    type: 'atom',
                    path: 'customers[0].rated',
                },
                {
                    type: 'atom',
                    path: 'employee',
                },
            ],
        },
    });
    expect(rule.evaluate(exampleData)).resolves.toBe(false);
});
it('member || visit.paymentDetails.payed', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'or',
            arguments: [
                {
                    type: 'atom',
                    path: 'member',
                },
                {
                    type: 'atom',
                    path: 'visit.paymentDetails.payed',
                },
            ],
        },
    });
    expect(rule.evaluate(exampleData)).resolves.toBe(true);
});
it('member || member || visit.paymentDetails.payed', () => {
    const rule = p.parseRule({
        ...ruleTemplate,
        rule: {
            type: 'or',
            arguments: [
                {
                    type: 'atom',
                    path: 'member',
                },
                {
                    type: 'atom',
                    path: 'member',
                },
                {
                    type: 'atom',
                    path: 'visit.paymentDetails.payed',
                },
            ],
        },
    });
    expect(rule.evaluate(exampleData)).resolves.toBe(true);
});
