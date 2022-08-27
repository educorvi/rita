// @ts-ignore
import einfuehrung from './einfuehrung.json';
// @ts-ignore
import calculationComplex from './calculationComplex.json';
// @ts-ignore
import calculationSimple from './calculationSimple.json';
// @ts-ignore
import comparison from './comparison.json';
// @ts-ignore
import comparisonDate from './comparisonDate.json';
// @ts-ignore
import comparisonString from './comparisonString.json';
// @ts-ignore
import modulo from './modulo.json';
// @ts-ignore
import simpleRule from './simpleRule.json';

// @ts-ignore
import simpleRuleUnsat from './simpleRuleUnsat.json';
// @ts-ignore
import comparisonUnsat from './comparisonUnsat.json';
import SmtSolver from '../src';
import { evaluateAll, Parser } from '@educorvi/rita';

const examples_satisfiable = {
    einfuehrung,
    calculationComplex,
    calculationSimple,
    comparison,
    comparisonDate,
    comparisonString,
    modulo,
    simpleRule,
};

const examples_unsatisfiable = {
    simpleRuleUnsat,
    comparisonUnsat,
};

const parser = new Parser();

function testExamples(examples: Record<string, any>, awaited_result: boolean) {
    for (const key of Object.keys(examples)) {
        //@ts-ignore
        const ruleset = parser.parseRuleSet(examples[key]);
        const smts = new SmtSolver(true);
        for (const rule of ruleset) {
            smts.assertRule(rule);
        }
        it(`${key}: satisfieability`, async function () {
            let sat = await smts.checkSat();
            expect(sat.satisfieable).toBe(awaited_result);
            if (sat.satisfieable) {
                expect(sat.model).toBeDefined();
                // console.log(model);
                const ev = await evaluateAll(
                    ruleset,
                    <Record<string, any>>sat.model
                );
                expect(ev.result).toBe(true);
            }
        });
    }
}

describe('test satisfiable examples', function () {
    testExamples(examples_satisfiable, true);
});
describe('test unsatisfiable examples', function () {
    testExamples(examples_unsatisfiable, false);
});
