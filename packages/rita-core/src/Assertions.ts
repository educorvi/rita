import duration from 'dayjs/plugin/duration';
import type { Duration } from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import { Formula } from './logicElements';

dayjs.extend(duration);
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
    if (!dayjs.isDuration(value)) {
        throw new NotDurationError(context, value);
    }
}

export function assertArrayLike(
    value: unknown,
    context: Formula
): asserts value is unknown & { length: number } {
    if (!value?.hasOwnProperty('length')) {
        throw new HasNoLengthError(context, value);
    }
}
