import einfuehrung from './einfuehrung.json';
import calculationComplex from './calculationComplex.json';
import calculationSimple from './calculationSimple.json';
import comparison from './comparison.json';
import comparisonDate from './comparisonDate.json';
import comparisonString from './comparisonString.json';
import modulo from './modulo.json';
import simpleRule from './simpleRule.json';

import simpleRuleUnsat from './simpleRuleUnsat.json';
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
