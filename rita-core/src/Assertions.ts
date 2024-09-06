import { Duration } from 'luxon';

export function assertBoolean(value: unknown): asserts value is boolean {
    if (typeof value !== 'boolean') {
        throw new TypeError('Value is not a boolean: ' + value?.toString());
    }
}

export function assertNumber(value: unknown): asserts value is number {
    if (typeof value !== 'number') {
        throw new TypeError('Value is not a number: ' + value?.toString());
    }
}

export function assertDate(value: unknown): asserts value is Date {
    if (!(value instanceof Date)) {
        throw new TypeError('Value is not a date: ' + value?.toString());
    }
}

export function assertNumberOrDate(
    value: unknown
): asserts value is number | Date {
    if (!(typeof value === 'number' || value instanceof Date)) {
        throw new TypeError(
            'Value is neither a number nor a data: ' + value?.toString()
        );
    }
}

export function assertDuration(value: unknown): asserts value is Duration {
    if (!Duration.isDuration(value)) {
        throw new TypeError('Value is not a duration: ' + value?.toString());
    }
}

export function hasLength(
    value: unknown
): asserts value is Record<any, any> & { length: number } {
    if (!value || !value.hasOwnProperty('length')) {
        throw new TypeError(
            'Value does not have a length property: ' + value?.toString()
        );
    }
}
