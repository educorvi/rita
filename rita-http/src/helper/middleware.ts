import express, {
    ErrorRequestHandler,
    NextFunction,
    Request,
    Response,
} from 'express';
import { logger } from './globals';
import bodyParser from 'body-parser';
import { NotFoundError, UnauthorizedError } from '../Errors';
import { ValidateError } from '@tsoa/runtime';
import { UsageError } from '@educorvi/rita';
import { Connect } from 'vite';

/**
 * All the middleware for the express server
 */

/**
 * Log requests.
 * @param req
 * @param res
 * @param next
 */
function accessLogger(req: Request, res: Response, next: NextFunction) {
    logger.debug(req.method + ': ' + req.originalUrl);
    next();
}

/**
 * Export of every middleware
 */
export const middleware: Connect.NextHandleFunction[] = [
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    express.static('docs'),
    accessLogger,
];

/**
 * Handle errors.
 * @param err
 * @param req
 * @param res
 * @param next
 */
export const errorHandler: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 404 - Not Found
    if (err instanceof NotFoundError) {
        logger.debug('404 on ' + req.url);
        return res.status(404).json({ message: err.message });
    }

    // 422 - Validation failed
    if (err instanceof ValidateError) {
        logger.debug(`Caught Validation Error for ${req.path}:`);
        logger.debug(err.fields);
        return res.status(422).json({
            message: 'Validation Failed',
            details: err?.fields,
        });
    }

    // 401 - Unauthorized
    if (err instanceof UnauthorizedError) {
        logger.debug(err);
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }

    // Variable 4xx Errors
    if (err?.statusCode >= 400 && err?.statusCode < 500) {
        logger.debug(err);
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    if (err instanceof UsageError) {
        return res.status(400).json({
            message: err.message,
        });
    }
    // 500 - Internal Error
    if (err instanceof Error) {
        logger.error(err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }

    next();
};
