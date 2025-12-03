import {
    Atom,
    Calculation,
    Comparison,
    DateCalculation,
    Formula,
    Operator,
    Quantifier,
    Rule,
} from './logicElements';

export type EvaluationDetails = {
    /**
     * The ID of the rule
     */
    id: string;

    /**
     * The result of the rule
     */
    result: boolean;
};
export type EvaluationResult = {
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

type AtomSearchResults = {
    pathSet: string[];
    atoms: Atom[];
};

function mergeAtomSearchResults(
    base: AtomSearchResults,
    add: AtomSearchResults
) {
    for (const path of add.pathSet) base.pathSet.push(path);
    base.atoms.push(...add.atoms);
}

export function getAtoms(rules: Rule[]): AtomSearchResults {
    const paths: Set<string> = new Set();
    const atoms: Atom[] = [];
    for (const rule of rules) {
        const res = getAtomsFromFormula(rule.rule);
        mergeAtomSearchResults({ pathSet: Array.from(paths), atoms }, res);
    }
    return { pathSet: Array.from(paths), atoms };
}

function getAtomsFromFormula(formula: Formula): AtomSearchResults {
    const paths: Set<string> = new Set();
    const atoms: Atom[] = [];
    if (formula instanceof Atom) {
        paths.add(formula.path);
        atoms.push(formula);
    } else if (
        formula instanceof Operator ||
        formula instanceof Calculation ||
        formula instanceof Comparison ||
        formula instanceof DateCalculation
    ) {
        for (const formulaElement of formula.arguments) {
            if (!(formulaElement instanceof Formula)) continue;

            const res = getAtomsFromFormula(formulaElement);
            mergeAtomSearchResults({ pathSet: Array.from(paths), atoms }, res);
        }
    } else if (formula instanceof Quantifier) {
        if (formula.array instanceof Atom) {
            paths.add(formula.array.path);
            atoms.push(formula.array);
        } else {
            for (const formulaElement of formula.array) {
                const res = getAtomsFromFormula(formulaElement);
                mergeAtomSearchResults(
                    { pathSet: Array.from(paths), atoms },
                    res
                );
            }
        }
    }
    return { pathSet: Array.from(paths), atoms };
}
