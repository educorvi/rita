import { Rule } from './logicElements';

type EvaluationDetails = {
    /**
     * The ID of the rule
     */
    id: string;

    /**
     * The result of the rule
     */
    result: boolean;
};
type EvaluationResult = {
    /**
     * The result of all rules combined (combined by logical "and")
     */
    result: boolean;

    /**
     * Amount of rules that were evaluated to true or false respectively.
     */
    counts: {
        true: number;
        false: number;
    };

    /**
     * The results for every rule
     */
    details: Array<EvaluationDetails>;
};

/**
 * Evaluates all rules and returns details on the result
 * @param rules
 * @param data
 */
export async function evaluateAll(
    rules: Array<Rule>,
    data: Record<string, any>
): Promise<EvaluationResult> {
    const ret: EvaluationResult = {
        result: true,
        details: [],
        counts: {
            true: 0,
            false: 0,
        },
    };
    for (const rule of rules) {
        let evaluated = await rule.evaluate(data);
        if (evaluated) ret.counts.true++;
        else ret.counts.false++;
        ret.result = ret.result && evaluated;
        ret.details.push({
            id: rule.id,
            result: evaluated,
        });
    }
    return ret;
}
