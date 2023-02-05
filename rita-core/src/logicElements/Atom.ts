import { Formula, FormulaResults } from './Formula';
import { DateTime } from 'luxon';
import { UndefinedPathError, UsageError } from '../Errors';

/**
 * Parses the date in the argument string. Throws an exception if date can not be parsed
 * @param val the string to be parsed
 */
export function parseDate(val: string): Date {
    const testDate = DateTime.fromISO(val).toJSDate();
    if (!isNaN(testDate.getTime())) {
        return testDate;
    } else {
        throw new UsageError(`Date "${val}" could not be parsed`);
    }
}

/**
 * An atom that gets it value from the data
 */
export class Atom extends Formula {
    /**
     * The path of the value in the data
     */
    public path: string;
    public isDate: boolean;

    constructor(path: string, isDate: boolean = false) {
        super();
        this.path = path;
        this.isDate = isDate;
    }

    /**
     * Get the value of an object property or array by a path that is passed as string
     * @param o object
     * @param s path
     * @private
     */
    private static getPropertyByString(
        o: any,
        s: string
    ): boolean | string | number {
        s = s.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, ''); // strip a leading dot
        const a = s.split('.');
        for (let i = 0, n = a.length; i < n; ++i) {
            const k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                throw new UndefinedPathError('Undefinded path in data: ' + s);
            }
        }
        return o;
    }

    validate(): boolean {
        return !!this.path;
    }

    toJsonReady(): Record<string, any> {
        const at: Record<string, any> = {
            type: 'atom',
            path: this.path,
        };
        if (this.isDate) at['isDate'] = true;
        return at;
    }

    async evaluate(
        data: Record<string, any>
    ): Promise<FormulaResults | Array<FormulaResults>> {
        const val = Atom.getPropertyByString(data, this.path);

        if (typeof val === 'string' && this.isDate) {
            return parseDate(val);
        }
        return val;
    }
}
