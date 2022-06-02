import { evaluateAll, Rule } from '@educorvi/rita';
import { RuleNotFoundError } from './Helper/Errors';

export default class Ruleset {
    private rules: Array<Rule>;
    public readonly id: string;
    public name: string;
    public description: string;

    constructor(
        id: string,
        name: string,
        rules: Array<Rule> = [],
        description: string = ''
    ) {
        this.rules = rules;
        this.id = id;
        this.name = name;
        this.description = description;
    }

    /**
     * Adds a rule to the ruleset.
     * @param rule The rule to add to the ruleset
     */
    addRule(rule: Rule) {
        this.rules.push(rule);
    }

    /**
     * Deletes a rule from the ruleset.
     * @param id The ID of the rule
     */
    deleteRule(id: string) {
        if (this.rules.filter((value) => value.id === id).length === 0) {
            throw new RuleNotFoundError();
        }
        this.rules = this.rules.filter((value) => value.id !== id);
    }

    /**
     * Gets all rules from the ruleset.
     */
    getAllRules(): Array<Rule> {
        return this.rules;
    }

    /**
     * Evaluates the ruleset.
     * @param data The data to evaluate against
     */
    evaluate(data: Record<string, any>) {
        return evaluateAll(this.rules, data);
    }
}
