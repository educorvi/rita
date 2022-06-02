import Ajv from 'ajv/dist/2019';
import addFormats from 'ajv-formats';
import { Parser } from '../src';
// @ts-ignore
import exampleRule from './assets/example1.json';
// @ts-ignore
import exampleMathDefault from './assets/exampleMath.json';
// @ts-ignore
import exampleMathSimple from './assets/mathSimple.json';
// @ts-ignore
import wrongExampleRule from './assets/example_wrong.json';
// @ts-ignore
import rule_qfa from './assets/quantifiers_fa.json';
// @ts-ignore
import rule_qex from './assets/quantifiers_ex.json';
// @ts-ignore
import macros from './assets/macros';
import { DateTime } from 'luxon';

//Prevent timezone error when converting from json and back
const exampleMath = JSON.parse(JSON.stringify(exampleMathDefault));
exampleMath.rules[0].rule.arguments[0].arguments[0].arguments[0] =
    DateTime.fromJSDate(new Date()).toISO();

const schemas = [
    {
        name: 'Atom',
        // @ts-ignore
        schema: () => import('../src/schema/atom.json'),
    },
    {
        name: 'Operator',
        // @ts-ignore
        schema: () => import('../src/schema/operator.json'),
    },
    {
        name: 'Comparison',
        // @ts-ignore
        schema: () => import('../src/schema/comparison.json'),
    },
    {
        name: 'Calculation',
        // @ts-ignore
        schema: () => import('../src/schema/calculation.json'),
    },
    {
        name: 'Term',
        // @ts-ignore
        schema: () => import('../src/schema/formula.json'),
    },
    {
        name: 'Rule',
        // @ts-ignore
        schema: () => import('../src/schema/rule.json'),
    },
    {
        name: 'Quantifier',
        // @ts-ignore
        schema: () => import('../src/schema/quantifier.json'),
    },
    {
        name: 'Macro',
        // @ts-ignore
        schema: () => import('../src/schema/macro.json'),
    },
    {
        name: 'Plugin',
        // @ts-ignore
        schema: () => import('../src/schema/plugin.json'),
    },

    {
        name: 'Main',
        // @ts-ignore
        schema: () => import('../src/schema/schema.json'),
    },
];

describe('Validate Schema against Meta-Schema', () => {
    const ajv = new Ajv();
    addFormats(ajv);

    for (const schema of schemas) {
        it(schema.name, () => {
            expect.assertions(1);
            schema
                .schema()
                .then((res) => expect(ajv.validateSchema(res)).toBe(true));
        });
    }
});

const p = new Parser();

function validateSchema(schema: Record<string, any>, expected = true) {
    const result = p.validateRuleSetJSON(schema);
    if (result.valid !== expected) {
        console.warn(result.errors);
    }
    expect(result.valid).toBe(expected);
}

describe('Validate Rule examples', () => {
    it('Example', () => {
        validateSchema(exampleRule);
    });

    it('Math Simple', () => {
        validateSchema(exampleMathSimple);
    });

    it('Math', () => {
        validateSchema(exampleMath);
    });

    it('Wrong Rule', () => {
        const result = p.validateRuleSetJSON(wrongExampleRule);
        expect(result.valid).toBe(false);
        expect(result.errors).not.toHaveLength(0);
    });

    describe('convert to objects and back to json', () => {
        const examples = [
            exampleRule,
            exampleMathSimple,
            exampleMath,
            rule_qfa,
            rule_qex,
            macros,
        ];
        for (let i = 0; i < examples.length; i++) {
            const example = examples[i];
            it('Ruleset ' + i, () => {
                const $schema = example.$schema;
                const ruleset = p.parseRuleSet(example);
                const json = Parser.toJson(ruleset);
                expect({ ...JSON.parse(json), $schema }).toEqual({
                    ...example,
                    $schema,
                });
                const ruleset2 = p.parseRuleSet(JSON.parse(json));
                const json2 = Parser.toJson(ruleset2);
                expect({ ...JSON.parse(json2), $schema }).toEqual({
                    ...example,
                    $schema,
                });
            });
        }
    });
});
