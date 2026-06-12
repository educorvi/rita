import { Body, Controller, Path, Post, Route } from '@tsoa/runtime';
import { rita } from '../helper/globals';
import { NotFoundError } from '../Errors';
import { Security, Response } from 'tsoa';
import { errorResponse } from './responseTypes';

/**
 * Controller for everything evaluation related
 */

/**
 * Type of results of an evaluation
 */
type evaluationResult = {
    result: boolean;
    counts: {
        true: number;
        false: number;
    };
    details: {
        id: string;
        result: boolean;
    }[];
};

/**
 * type of data to evaluate against
 */
type evaluationData = {
    [key: string]: any;
};

/**
 * Evaluation route
 */
@Route('evaluate')
export class EvaluationController extends Controller {
    @Post('{rulesetID}')
    @Security('api_key', ['evaluate'])
    @Response<errorResponse>('404', 'Not Found')
    @Response<errorResponse>('401', 'Unauthorized')
    @Response<errorResponse>(
        '422',
        'Validation Error: An invalid object has been passed'
    )
    public async evaluateRuleset(
        @Path() rulesetID: string,
        @Body() data: evaluationData
    ): Promise<evaluationResult> {
        const ruleset = await rita.getRuleset(rulesetID);
        if (!ruleset) {
            throw new NotFoundError();
        }
        return await ruleset.evaluate(data);
    }
}
