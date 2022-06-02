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

export function assertArray(value: any): asserts value is Array<any> {
    if (!Array.isArray(value)) {
        throw new TypeError();
    }
}
