import macroRuleset from '../assets/macros';
import { evaluateAll, Parser } from '../../src';
import { exampleData } from '../assets/exampleData';

const p = new Parser();

it("Expect 'now' to be correct", async () => {
    const m = p.parseMacro({
        type: 'macro',
        macro: {
            type: 'now',
        },
    });
    await new Promise((r) => setTimeout(r, 1000));
    const currDate = new Date().getTime();
    const evaluated = <Date>await m.evaluate({});
    expect(evaluated.getTime()).toBeWithin(currDate, currDate + 100);
});

it("Expect 'length' to be correct", () => {
    const m = p.parseMacro({
        type: 'macro',
        macro: {
            type: 'length',
            array: {
                type: 'atom',
                path: 'data',
            },
        },
    });
    const l = Math.round(Math.random() * 10 + 1);
    expect(
        m.evaluate({
            data: Array.from(Array(l).keys()),
        })
    ).resolves.toEqual(l);
});

it("Test 'length' for string", () => {
    const m = p.parseMacro({
        type: 'macro',
        macro: {
            type: 'length',
            array: {
                type: 'atom',
                path: 'data',
            },
        },
    });
    const l = Math.round(Math.random() * 10 + 1);
    const string = new Array(l + 1).join('e');

    expect(
        m.evaluate({
            data: string,
        })
    ).resolves.toEqual(l);
});

it('Example Ruleset is true', async () => {
    const rs = p.parseRuleSet(macroRuleset);
    expect((await evaluateAll(rs, exampleData)).result).toBe(true);
});
