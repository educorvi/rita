import { Rule } from '@educorvi/rita';
import SmtSolver from './SmtSolver';
import { And, Not, SNode, Xor } from '@educorvi/smtlib';
import { Terminal } from 'terminal-kit';

export default async function simplify(
    rules: Array<Rule>,
    term?: Terminal,
    updateProgress?: (progress: number) => void
): Promise<Array<Rule>> {
    // const smt = new SmtSolver();
    // const simplifiedSMT = await smt.simplify(
    //     formulas.reduce((previousValue: SNode, currentValue: Formula) => {
    //         return And(previousValue, smt.parseFormula(currentValue));
    //     }, 'true')
    // );
    // console.log(simplifiedSMT);
    //
    // return JSON.stringify({});
    let newRuleset: Array<Rule> = [];
    rules.forEach((val) => newRuleset.push(val));

    let simplificationOptions: Array<foundImplication>;
    do {
        if (term) {
            term('Searching simplification possibilities... \n');
        }
        const temp: Array<foundImplication> = await findImplications(
            newRuleset,
            updateProgress
        );
        if (term) {
            term('\n');
        }
        const shortestPrerequisite = temp[0]?.prerequisite.length || 0;
        simplificationOptions = temp.filter(
            (imp) => imp.prerequisite.length === shortestPrerequisite
        );
        if (term) {
            term.green(`Found ${simplificationOptions.length}\n`);
        }
        for (const simplificationOption of simplificationOptions) {
            if (
                simplificationOption.prerequisite.filter((p) =>
                    newRuleset.includes(p)
                ).length === simplificationOption.prerequisite.length
            ) {
                newRuleset = newRuleset.filter(
                    (rule) => !simplificationOption.consequence.includes(rule)
                );
            }
        }
    } while (simplificationOptions.length);

    const verifier = new SmtSolver();
    verifier.assertSMT(
        Xor(
            reduceSubSetToSMT(rules, verifier),
            reduceSubSetToSMT(newRuleset, verifier)
        )
    );

    if (term) {
        term('Verifying result... ');
    }
    const valid = !(await verifier.checkSat()).satisfiable;

    if (term) {
        if (valid) {
            term.green('Valid\n');
        } else {
            term.red('Invalid\n');
            throw new Error('Internal Error: Invalid Simplification');
        }
    }

    return newRuleset;
}

function powerSet<T>(set: Array<T>): Array<Array<T>> {
    const initialArray: Array<Array<T>> = [[]];
    return set.reduce(
        (subsets, value) =>
            subsets.concat(subsets.map((set) => [value, ...set])),
        initialArray
    );
}

function reduceSubSetToSMT(rules: Array<Rule>, solver: SmtSolver): SNode {
    return rules.reduce((prev: SNode, curr, ind) => {
        if (ind === 0) {
            return solver.parseFormula(curr.rule);
        } else {
            return And(prev, solver.parseFormula(curr.rule));
        }
    }, '');
}

export type foundImplication = {
    prerequisite: Array<Rule>;
    consequence: Array<Rule>;
};

export async function findImplications(
    rules: Array<Rule>,
    updateProgress?: (progress: number) => void
): Promise<Array<foundImplication>> {
    const found: Array<foundImplication> = [];
    const p1 = powerSet(rules).filter((i) => i.length > 0);
    const totalSteps = p1.length * p1.length;
    let currentStep = 0;
    for (const left of p1) {
        for (const right of p1) {
            if (updateProgress) {
                updateProgress(++currentStep / totalSteps);
            }
            let double = false;
            for (const rule of right) {
                if (left.includes(rule)) {
                    double = true;
                    break;
                }
            }
            if (double) continue;
            let solver = new SmtSolver();
            solver.assertSMT(
                And(
                    reduceSubSetToSMT(left, solver),
                    Not(reduceSubSetToSMT(right, solver))
                )
            );
            const satRes = await solver.checkSat();
            if (!satRes.satisfiable) {
                found.push({
                    prerequisite: left,
                    consequence: right,
                });
            }
        }
    }

    return found.sort(
        (f1, f2) => f1.prerequisite.length - f2.prerequisite.length
    );
}
