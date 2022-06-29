import { evaluateAll, Parser, UsageError } from '@educorvi/rita';
import HTTP_Plugin from '../src/index';

const p = new Parser([HTTP_Plugin]);

const address = 'http://localhost:3123';
const ruleset = {
    rules: [
        {
            id: 'rule1',
            rule: {
                type: 'plugin',
                name: 'http',
                options: { url: address },
                formula: {
                    type: 'and',
                    arguments: [
                        {
                            type: 'atom',
                            path: 'member',
                        },
                        {
                            type: 'not',
                            arguments: [
                                {
                                    type: 'atom',
                                    path: 'employee',
                                },
                            ],
                        },
                    ],
                },
            },
        },
    ],
};
const postRuleset = {
    rules: [
        {
            id: 'rule1',
            rule: {
                type: 'plugin',
                name: 'http',
                options: { url: address, method: 'POST' },
                formula: {
                    type: 'and',
                    arguments: [
                        {
                            type: 'atom',
                            path: 'response.member',
                        },
                        {
                            type: 'not',
                            arguments: [
                                {
                                    type: 'atom',
                                    path: 'response.employee',
                                },
                            ],
                        },
                    ],
                },
            },
        },
    ],
};

describe('get', function () {
    it('getRuleset', async () => {
        const r = p.parseRuleSet(ruleset);
        expect((await evaluateAll(r, {})).result).toBe(true);
    });
    it('wrong url', async () => {
        const changedRuleSet = JSON.parse(JSON.stringify(ruleset));
        changedRuleSet.rules[0].rule.options.url += '/404notfound';
        const r = p.parseRuleSet(changedRuleSet);
        await expect(evaluateAll(r, {})).rejects.toThrow(UsageError);
    });
});

describe('post', function () {
    it('post', async function () {
        const r = p.parseRuleSet(postRuleset);
        expect(
            (
                await evaluateAll(r, {
                    member: true,
                    employee: false,
                    visit: {
                        paymentDetails: {
                            payed: true,
                        },
                        priceWithoutTax: 10.99,
                        tax: 1,
                    },
                    customers: [
                        {
                            rated: false,
                        },
                        {
                            rated: true,
                        },
                    ],
                    dateOfBirth: '2000-01-01T00:00:00+00:00',
                    name: 'Julian',
                })
            ).result
        ).toBe(true);
    });
});
