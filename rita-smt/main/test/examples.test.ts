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
import dateCalculation from './dateCalculation1.json';
// @ts-ignore
import dateCalculation2 from './dateCalculation2.json';
// @ts-ignore
import dateCalculation3 from './dateCalculation3.json';

// @ts-ignore
import simpleRuleUnsat from './simpleRuleUnsat.json';
// @ts-ignore
import comparisonUnsat from './comparisonUnsat.json';
import { RitaSmtSolver as SmtSolver } from '../src';
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
    dateCalculation,
    dateCalculation2,
    dateCalculation3,
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
        let unResolvedSat = smts.checkSat();
        it(key, async function () {
            const sat = await unResolvedSat;
            expect(sat.satisfiable).toBe(awaited_result);
            if (sat.satisfiable) {
                expect(sat.model).toBeDefined();
            }
        });
        it(key + ' inverse', async function () {
            const sat = await unResolvedSat;
            if (sat.satisfiable) {
                expect(sat.model).toBeDefined();
                // console.log(sat.model);
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
