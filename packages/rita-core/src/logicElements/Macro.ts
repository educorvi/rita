import { Formula, FormulaResults } from './Formula';
import { Atom } from './Atom';
import { assertArrayLike } from '../Assertions';

export class Macro extends Formula {
    /** Indicates the type of this atom **/
    private readonly macro: 'now' | 'length';

    /** If the type of the macro is 'length', this is the Atom that contains the array **/
    public readonly array?: Atom;

    constructor(macro: 'now' | 'length', array?: Atom) {
        super();
        this.macro = macro;
        this.array = array;
    }

    async evaluate(data: Record<string, any>): Promise<FormulaResults> {
        switch (this.macro) {
            case 'now':
                return new Date();
            case 'length':
                const ar = await this.array?.evaluate(data);
                assertArrayLike(ar, this);
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
