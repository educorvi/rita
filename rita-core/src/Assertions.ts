import { Duration } from 'luxon';
import { Formula } from './logicElements';
import {
    HasNoLengthError,
    NotBooleanError,
    NotDateError,
    NotDurationError,
    NotNumberError,
    NotNumberOrDateError,
} from './Errors';

export function assertBoolean(
    value: unknown,
    context: Formula
): asserts value is boolean {
    if (typeof value !== 'boolean') {
        throw new NotBooleanError(context, value);
    }
}

export function assertNumber(
    value: unknown,
    context: Formula
): asserts value is number {
    if (typeof value !== 'number') {
        throw new NotNumberError(context, value);
    }
}

export function assertDate(
    value: unknown,
    context: Formula
): asserts value is Date {
    if (!(value instanceof Date)) {
        throw new NotDateError(context, value);
    }
}

export function assertNumberOrDate(
    value: unknown,
    context: Formula
): asserts value is number | Date {
    if (!(typeof value === 'number' || value instanceof Date)) {
        throw new NotNumberOrDateError(context, value);
    }
}

export function assertDuration(
    value: unknown,
    context: Formula
): asserts value is Duration {
    if (!Duration.isDuration(value)) {
        throw new NotDurationError(context, value);
    }
}

export function hasLength(
    value: unknown,
    context: Formula
): asserts value is unknown & { length: number } {
    if (!value || !value.hasOwnProperty('length')) {
        throw new HasNoLengthError(context, value);
    }
}
