import { Formula } from './Formula';
import { RulesetError } from '../Errors';

/**
 * Parent class for all operators
 */
export abstract class Operator extends Formula {
    /**
     * The arguments of the operator
     */
    public arguments: Array<Formula>;

    /**
     * @constructor
     * @param formulaArguments The arguments of the operator
     */
    constructor(formulaArguments: Array<Formula>) {
        super();
        this.arguments = formulaArguments;
    }

    abstract evaluate(data: Record<string, any>): Promise<boolean>;

    validate(): boolean {
        return this.arguments
            .map((it) => it.validate())
            .reduce((p, c) => p && c);
    }

    evaluateReduce(
        data: Record<string, any>,
        func: (x1: boolean, x2: boolean) => boolean,
        defaultValue = Promise.resolve(false)
    ): Promise<boolean> {
        return this.arguments.reduce(
            async (acc: Promise<boolean>, curr: Formula): Promise<boolean> => {
                return func(await acc, <boolean>await curr.evaluate(data));
            },
            defaultValue
        );
    }

    toJsonReady(): Record<string, any> {
        return {
            arguments: this.arguments.map((item) => item.toJsonReady()),
        };
    }
}

/**
 * "And" Operator
 * Behaves like "&&" in JavaScript when evaluated
 */
export class And extends Operator {
    evaluate(data: Record<string, any>): Promise<boolean> {
        if (!this.validate())
            throw new RulesetError(
                'Invalid: ' + JSON.stringify(this.toJsonReady())
            );

        return this.evaluateReduce(
            data,
            (x1, x2) => x1 && x2,
            Promise.resolve(true)
        );
    }

    validate(): boolean {
        return this.arguments.length > 1 && super.validate();
    }

    toJsonReady(): Record<string, any> {
        return {
            ...super.toJsonReady(),
            type: 'and',
        };
    }
}

/**
 * "Not" Operator
 * Behaves like "!" in JavaScript when evaluated
 */
export class Not extends Operator {
    async evaluate(data: Record<string, any>): Promise<boolean> {
        if (!this.validate())
            throw new RulesetError(
                'Invalid: ' + JSON.stringify(this.toJsonReady())
            );

        return Promise.resolve(!(await this.arguments[0].evaluate(data)));
    }

    validate(): boolean {
        return this.arguments.length === 1 && super.validate();
    }

    toJsonReady(): Record<string, any> {
        return {
            ...super.toJsonReady(),
            type: 'not',
        };
    }
}

/**
 * "Or" Operator
 * Behaves like || in JavaScript when evaluated
 */
export class Or extends Operator {
    evaluate(data: Record<string, any>): Promise<boolean> {
        if (!this.validate())
            throw new RulesetError(
                'Invalid: ' + JSON.stringify(this.toJsonReady())
            );

        return this.evaluateReduce(data, (x1, x2) => x1 || x2);
    }

    validate(): boolean {
        return this.arguments.length > 1 && super.validate();
    }

    toJsonReady(): Record<string, any> {
        return {
            ...super.toJsonReady(),
            type: 'or',
        };
    }
}
