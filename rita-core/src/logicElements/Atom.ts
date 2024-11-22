import { Formula, FormulaResults } from './Formula';
import { DateTime } from 'luxon';
import { UndefinedPathError, UsageError } from '../Errors';

/**
 * Parses the date in the argument string. Throws an exception if date can not be parsed
 * @param val the string to be parsed
 * @param context the context of the formula
 */
export function parseDate(val: string, context?: Formula): Date {
    const testDate = DateTime.fromISO(val).toJSDate();
    if (!isNaN(testDate.getTime())) {
        return testDate;
    } else {
        throw new UsageError(`Date "${val}" could not be parsed`, context);
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
    public defaultValue?: FormulaResults | Array<FormulaResults>;

    constructor(
        path: string,
        isDate: boolean = false,
        defaultValue?: FormulaResults | Array<FormulaResults>
    ) {
        super();
        this.path = path;
        this.isDate = isDate;
        this.defaultValue = defaultValue;
    }

    /**
     * Get the value of an object property or array by a path that is passed as string
     * @param object object
     * @param path path
     * @param defaultVal default value to return if path is not found
     * @param context the context of the formula
     */
    static getPropertyByString(
        object: any,
        path: string,
        defaultVal?: FormulaResults | Array<FormulaResults>,
        context?: Formula
    ): FormulaResults | FormulaResults[] {
        path = path.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
        path = path.replace(/^\./, ''); // strip a leading dot
        const a = path.split('.');
        for (let i = 0, n = a.length; i < n; ++i) {
            const k = a[i];
            if (typeof object === 'undefined') {
                if (defaultVal !== undefined) {
                    return defaultVal;
                } else {
                    throw new UndefinedPathError(
                        'Undefinded path in data: ' + path,
                        context
                    );
                }
            }
            if (k in object) {
                object = object[k];
            } else if (defaultVal !== undefined) {
                return defaultVal;
            } else {
                throw new UndefinedPathError(
                    'Undefinded path in data: ' + path,
                    context
                );
            }
        }
        return object;
    }

    /**
     * Get the value of an object property or array by a path that is passed as string
     * @param object object
     * @private
     */
    getPropertyByString(object: any): FormulaResults | FormulaResults[] {
        return Atom.getPropertyByString(
            object,
            this.path,
            this.defaultValue,
            this
        );
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
        if (this.defaultValue !== undefined) at['default'] = this.defaultValue;
        return at;
    }

    async evaluate(
        data: Record<string, any>
    ): Promise<FormulaResults | FormulaResults[]> {
        let val: FormulaResults | FormulaResults[] =
            this.getPropertyByString(data);

        if (typeof val === 'string' && this.isDate) {
            return parseDate(val, this);
        }
        return val;
    }
}
