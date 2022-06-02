/**
 * Indicates that the package is used in a wrong way
 */
export class UsageError extends Error {
    constructor(message: string) {
        super(message);
    }
}

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
export class UndefinedPathError extends UsageError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * There is an error in the ruleset
 */
export class RulesetError extends UsageError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * There was an internal error.
 */
export class InternalError extends Error {
    constructor(message: string) {
        super(message);
    }
}
