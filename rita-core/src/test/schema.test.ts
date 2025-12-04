import Ajv from 'ajv/dist/2019';
import addFormats from 'ajv-formats';
import { Parser } from '../index';
import exampleRule from './assets/example1.json';
import exampleMathDefault from './assets/exampleMath.json';
import exampleMathSimple from './assets/mathSimple.json';
import wrongExampleRule from './assets/example_wrong.json';
import rule_qfa from './assets/quantifiers_fa.json';
import rule_qex from './assets/quantifiers_ex.json';
import rule_defaultValue from './assets/defaultVal.json';
import macros from './assets/macros';
import { DateTime } from 'luxon';

//Prevent timezone error when converting from json and back
const exampleMath = JSON.parse(JSON.stringify(exampleMathDefault));
exampleMath.rules[0].rule.arguments[0].arguments[0].arguments[0] =
    DateTime.fromJSDate(new Date()).toISO();

const schemas = [
    {
        name: 'Atom',
        schema: () => import('../schema/atom.json'),
    },
    {
        name: 'Operator',
        schema: () => import('../schema/operator.json'),
    },
    {
        name: 'Comparison',
        schema: () => import('../schema/comparison.json'),
    },
    {
        name: 'Calculation',
        schema: () => import('../schema/calculation.json'),
    },
    {
        name: 'DateCalculation',
        schema: () => import('../schema/dateCalculation.json'),
    },
    {
        name: 'Term',
        schema: () => import('../schema/formula.json'),
    },
    {
        name: 'Rule',
        schema: () => import('../schema/rule.json'),
    },
    {
        name: 'Quantifier',
        schema: () => import('../schema/quantifier.json'),
    },
    {
        name: 'Macro',
        schema: () => import('../schema/macro.json'),
    },
    {
        name: 'Plugin',
        schema: () => import('../schema/plugin.json'),
    },

    {
        name: 'Main',
        schema: () => import('../schema/schema.json'),
    },
];

describe('Validate Schema against Meta-Schema', () => {
    const ajv = new Ajv();
    addFormats(ajv);

    for (const schema of schemas) {
        it(schema.name, () => {
            expect.assertions(1);
            return schema
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
            rule_defaultValue,
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
