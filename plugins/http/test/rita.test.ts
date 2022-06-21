import { evaluateAll, Parser, UsageError } from '@educorvi/rita';
import HTTP_Plugin from '../src/index';

const p = new Parser([HTTP_Plugin]);

const address = 'http://localhost:3123';
const ruleset = {
    $schema: '../../src/schema/schema.json',
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

it('test', async () => {
    const r = p.parseRuleSet(ruleset);
    expect((await evaluateAll(r, {})).result).toBe(true);
});
it('wrong url', async () => {
    const changedRuleSet = JSON.parse(JSON.stringify(ruleset));
    changedRuleSet.rules[0].rule.options.url += '/404notfound';
    const r = p.parseRuleSet(changedRuleSet);
    await expect(evaluateAll(r, {})).rejects.toThrow(UsageError);
});
