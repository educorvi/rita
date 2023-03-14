import { evaluateAll, Parser, UsageError } from '@educorvi/rita';
import HTTP_Plugin from '../src/index';

const p = new Parser([HTTP_Plugin]);

const address = 'http://127.0.0.1:3123';
const data = {
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
};
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
const postRulesetLimited = {
    rules: [
        {
            id: 'rule1',
            rule: {
                type: 'plugin',
                name: 'http',
                options: {
                    url: address,
                    method: 'POST',
                    limitTo: ['member', 'visit.priceWithoutTax'],
                },
                formula: {
                    type: 'and',
                    arguments: [
                        {
                            type: 'atom',
                            path: 'response.member',
                        },
                        {
                            type: 'comparison',
                            operation: 'equal',
                            arguments: [
                                {
                                    type: 'atom',
                                    path: 'response.visit.priceWithoutTax',
                                },
                                10.99,
                            ],
                        },
                    ],
                },
            },
        },
    ],
};
const postRulesetMissing = {
    rules: [
        {
            id: 'rule1',
            rule: {
                type: 'plugin',
                name: 'http',
                options: {
                    url: address,
                    method: 'POST',
                    limitTo: ['member', 'visit.priceWithoutTax'],
                },
                formula: {
                    type: 'and',
                    arguments: [
                        {
                            type: 'atom',
                            path: 'response.employee',
                        },
                        {
                            type: 'comparison',
                            operation: 'equal',
                            arguments: [
                                {
                                    type: 'atom',
                                    path: 'response.visit.tax',
                                },
                                1,
                            ],
                        },
                    ],
                },
            },
        },
    ],
};
const postRulesetNone = {
    rules: [
        {
            id: 'rule1',
            rule: {
                type: 'plugin',
                name: 'http',
                options: {
                    url: address,
                    method: 'POST',
                    limitTo: [],
                },
                formula: {
                    type: 'and',
                    arguments: [
                        {
                            type: 'atom',
                            path: 'response.employee',
                        },
                        {
                            type: 'comparison',
                            operation: 'equal',
                            arguments: [
                                {
                                    type: 'atom',
                                    path: 'response.visit.tax',
                                },
                                1,
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
        expect((await evaluateAll(r, data)).result).toBe(true);
    });
    it('post limit', async function () {
        const r = p.parseRuleSet(postRulesetLimited);
        expect((await evaluateAll(r, data)).result).toBe(true);
    });
    it('post limit test missing', async function () {
        const r = p.parseRuleSet(postRulesetMissing);
        await expect(evaluateAll(r, data)).rejects.toThrow(UsageError);
    });
    it('post limit test none', async function () {
        const r = p.parseRuleSet(postRulesetNone);
        await expect(evaluateAll(r, data)).rejects.toThrow(UsageError);
    });
});
