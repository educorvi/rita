import Ajv from 'ajv/dist/2019';
import type { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { UsageError } from '../Errors';
import atomSchema from '../schema/atom.json';
import calculationSchema from '../schema/calculation.json';
import comparisonSchema from '../schema/comparison.json';
import dateCalculationSchema from '../schema/dateCalculation.json';
import formulaSchema from '../schema/formula.json';
import macroSchema from '../schema/macro.json';
import operatorSchema from '../schema/operator.json';
import pluginSchema from '../schema/plugin.json';
import quantifierSchema from '../schema/quantifier.json';
import rootSchema from '../schema/schema.json';
import ruleSchema from '../schema/rule.json';

/**
 * Results for validateRuleJSON
 */
export type ValidationResult = {
    /**
     * Indicates, if the rule is valid
     */
    valid: boolean;
    /**
     * Array of errors
     */
    errors: Array<any>;
};

export class Validator {
    validate: ValidateFunction | undefined;

    async init() {
        if (this.validate) return;
        const ajv = new Ajv({
            allErrors: true,
            strict: false,
        });

        addFormats(ajv);

        for (const schema of [
            atomSchema,
            calculationSchema,
            comparisonSchema,
            dateCalculationSchema,
            formulaSchema,
            macroSchema,
            operatorSchema,
            pluginSchema,
            quantifierSchema,
            ruleSchema,
        ]) {
            ajv.addSchema(schema);
        }

        this.validate = ajv.compile(rootSchema);
    }

    validateRuleSetJSON(ruleset: Record<string, unknown>): ValidationResult {
        if (!this.validate) {
            throw new UsageError('Validator not initialized');
        }
        let valid = false;
        try {
            valid = this.validate(ruleset);
        } catch (e) {
            console.error(e);
            return {
                valid,
                errors: [e],
            };
        }
        return {
            valid,
            errors: this.validate.errors || [],
        };
    }
}
