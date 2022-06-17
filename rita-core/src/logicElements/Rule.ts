import { Formula } from './Formula';

/**
 * A Rule that can be evaluated
 */
export class Rule {
    /**
     * The id of the rule
     */
    public readonly id: string;

    /**
     * The root of the rule
     */
    public rule: Formula;

    /**
     * A comment about what the rule does
     */
    public comment: string;

    constructor(id: string, rule: Formula, comment: string) {
        this.id = id;
        this.rule = rule;
        this.comment = comment;
    }

    public async evaluate(data: Record<string, any>): Promise<boolean> {
        return <boolean>await this.rule.evaluate(data);
    }

    public toJsonReady(): Record<string, any> {
        return {
            id: this.id,
            rule: this.rule.toJsonReady(),
            comment: this.comment,
        };
    }
}
