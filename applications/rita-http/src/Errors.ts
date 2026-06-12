import { UsageError as RitaUsageError } from '@educorvi/rita';

export class NotFoundError extends Error {
    constructor(message?: string) {
        super(message || 'The requested resource could not be found!');
    }
}

export class UnauthorizedError extends Error {
    constructor(message?: string) {
        super(message || 'The requested was unauthorized');
    }
}

export class UsageError extends RitaUsageError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
    }
}
