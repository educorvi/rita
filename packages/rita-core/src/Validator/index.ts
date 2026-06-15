import type { ValidateFunction } from 'ajv';
import { UsageError } from '../Errors';

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
    if (this.validate) {
      return;
    }
    this.validate = (await import('./RitaRulesetAjvValidator')).default;
  }

  validateRuleSetJSON(ruleset: Record<string, unknown>): ValidationResult {
    if (!this.validate) {
      throw new UsageError('Validator not initialized');
    }
    let valid = this.validate(ruleset);
    return {
      valid,
      errors: this.validate.errors || [],
    };
  }
}
