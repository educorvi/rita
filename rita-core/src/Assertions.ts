import { Duration } from 'luxon';

export function assertBoolean(value: any): asserts value is boolean {
    if (typeof value !== 'boolean') {
        throw new TypeError('Value is not a boolean: ' + value.toString());
    }
}

export function assertNumber(value: any): asserts value is number {
    if (typeof value !== 'number') {
        throw new TypeError('Value is not a number: ' + value.toString());
    }
}

export function assertDate(value: any): asserts value is Date {
    if (!(value instanceof Date)) {
        throw new TypeError('Value is not a date: ' + value.toString());
    }
}

export function assertNumberOrDate(value: any): asserts value is number | Date {
    if (!(typeof value === 'number' || value instanceof Date)) {
        throw new TypeError(
            'Value is neither a number nor a data: ' + value.toString()
        );
    }
}

export function assertDuration(value: any): asserts value is Duration {
    if (!Duration.isDuration(value)) {
        throw new TypeError('Value is not a duration: ' + value.toString());
    }
}

export function hasLength(
    value: any
): asserts value is Record<any, any> & { length: number } {
    if (!value || !value.hasOwnProperty('length')) {
        throw new TypeError(
            'Value does not have a length property: ' + value.toString()
        );
    }
}
