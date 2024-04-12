import { Duration } from 'luxon';
export function assertBoolean(value: any): asserts value is boolean {
    if (typeof value !== 'boolean') {
        throw new TypeError();
    }
}

export function assertNumber(value: any): asserts value is number {
    if (typeof value !== 'number') {
        throw new TypeError();
    }
}

export function assertDate(value: any): asserts value is Date {
    if (!(value instanceof Date)) {
        throw new TypeError();
    }
}

export function assertNumberOrDate(value: any): asserts value is number | Date {
    if (!(typeof value === 'number' || value instanceof Date)) {
        throw new TypeError();
    }
}

export function assertDuration(value: any): asserts value is Duration {
    if (!Duration.isDuration(value)) {
        throw new TypeError();
    }
}

export function hasLength(
    value: any
): asserts value is Record<any, any> & { length: number } {
    if (!('length' in value)) {
        throw new TypeError('Value does not have a length property');
    }
}
