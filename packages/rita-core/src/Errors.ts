import { Formula } from './logicElements';

/**
 * A general error in the Rita package
 */
export abstract class RitaError extends Error {
    public readonly context?: Formula;

    constructor(message: string, context?: Formula) {
        super(message);
        this.context = context;
    }
}

/**
 * Indicates that the package is used in a wrong way
 */
export class UsageError extends RitaError {}

/**
 * Tried to use a function that does not exist/is not yet implemented
 */
export class UnimplementedError extends UsageError {
    constructor(message?: string) {
        super(message || 'This function is not implemented');
    }
}

/**
 * A path into the data was invalid
 */
export class UndefinedPathError extends UsageError {}

/**
 * There is an error in the ruleset
 */
export class RulesetError extends UsageError {}

/**
 * There was an internal error.
 */
export class InternalError extends Error {}

/**
 * Invalid Type Error
 */
export abstract class InvalidTypeError extends UsageError {
    public readonly value: unknown;
    public readonly expectedType: string;
    protected constructor(
        context: Formula,
        value: unknown,
        expectedType: string
    ) {
        super(
            `Value is not of type ${expectedType}: ${value?.toString()}`,
            context
        );
        this.value = value;
        this.expectedType = expectedType;
    }
}

/**
 * Value has no length
 */
export class HasNoLengthError extends InvalidTypeError {
    constructor(context: Formula, value: unknown) {
        super(context, value, 'ArrayLike');
    }
}

/**
 * Value is not a boolean
 */
export class NotBooleanError extends InvalidTypeError {
    constructor(context: Formula, value: unknown) {
        super(context, value, 'boolean');
    }
}

/**
 * Value is not a number
 */
export class NotNumberError extends InvalidTypeError {
    constructor(context: Formula, value: unknown) {
        super(context, value, 'number');
    }
}

/**
 * Value is not a date
 */
export class NotDateError extends InvalidTypeError {
    constructor(context: Formula, value: unknown) {
        super(context, value, 'Date');
    }
}

/**
 * Value is neither number nor date
 */
export class NotNumberOrDateError extends InvalidTypeError {
    constructor(context: Formula, value: unknown) {
        super(context, value, 'number | Date');
    }
}

/**
 * Value is not a duration
 */
export class NotDurationError extends InvalidTypeError {
    constructor(context: Formula, value: unknown) {
        super(context, value, 'Duration');
    }
}
