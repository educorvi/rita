import { Formula, FormulaResults } from './Formula';
import { Atom } from './Atom';
import { assertArray } from '../Assertions';
import { RulesetError } from '../Errors';

export class Macro extends Formula {
    /** Indicates the type of this atom **/
    private readonly macro: 'now' | 'length';

    /** If the type of the macro is 'length', this is the Atom that contains the array **/
    private readonly array?: Atom;

    constructor(macro: 'now' | 'length', array?: Atom) {
        super();
        this.macro = macro;
        this.array = array;
    }

    evaluate(data: Record<string, any>): FormulaResults {
        if (!this.validate())
            throw new RulesetError(
                'Invalid: ' + JSON.stringify(this.toJsonReady())
            );

        switch (this.macro) {
            case 'now':
                return new Date();
            case 'length':
                const ar = this.array?.evaluate(data);
                assertArray(ar);
                return ar.length;
        }
    }

    toJsonReady(): Record<string, any> {
        return {
            type: 'macro',
            macro: {
                type: this.macro,
                array: this.array?.toJsonReady(),
            },
        };
    }

    validate(): boolean {
        return !(this.macro === 'length' && !this.array);
    }
}
