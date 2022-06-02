/**
 * Indicates that no matching rule was found
 */
export class RuleNotFoundError extends Error {
    constructor() {
        super('Rule not found');
    }
}

/**
 * Indicates a error in the database
 */
export class DatabaseError extends Error {
    constructor(m: string) {
        super(m || 'There was an Error while accessing the Database');
    }
}

/**
 * Is thrown when a closed database connection is tried to be accessed
 */
export class DatabaseConnectionClosedError extends DatabaseError {
    constructor() {
        super('The connection to the database has already been closed.');
    }
}
