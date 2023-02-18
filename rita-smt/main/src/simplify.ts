import { Rule } from '@educorvi/rita';
import SmtSolver from './SmtSolver';
import { And, Not, SNode, Xor } from '@educorvi/smtlib';
import { Terminal } from 'terminal-kit';

export default async function simplify(
    rules: Array<Rule>,
    term?: Terminal
): Promise<Array<Rule>> {
    let newRuleset: Array<Rule> = [];
    rules.forEach((val) => newRuleset.push(val));

    let simplificationOptions = await findImplications(rules);
    for (const simplificationOption of simplificationOptions) {
        newRuleset = newRuleset.filter(
            (r) => r !== simplificationOption.consequence
        );
    }

    const difference = rules.length - newRuleset.length;

    if (term) {
        term.yellow(
            `\n\nEliminated ${difference} ${
                difference !== 1 ? 'rules' : 'rule'
            }\n`
        );
    }

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

    if (valid) {
        if (term) {
            term.green('Valid\n\n');
        }
    } else {
        if (term) {
            term.red('Invalid\n\n');
        }
        throw new Error('Internal Error: Invalid Simplification');
    }

    return newRuleset;
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
    consequence: Rule;
};

export async function findImplications(
    rules: Array<Rule>
): Promise<Array<foundImplication>> {
    const found: Array<foundImplication> = [];

    // Create copy of rules array and sort it by descending length of ruleset to try to eliminate the most complex rules
    let base: Rule[] = [];
    rules.forEach((val) => base.push(val));
    base.sort(
        (r1, r2) =>
            JSON.stringify(r2.toJsonReady()).length -
            JSON.stringify(r1.toJsonReady()).length
    );

    let foundOne: boolean;
    do {
        foundOne = false;
        for (const rule of base) {
            const others = base.filter((r) => r !== rule);

            let solver = new SmtSolver(false, 0);
            solver.assertSMT(
                And(
                    reduceSubSetToSMT(others, solver),
                    Not(solver.parseFormula(rule.rule))
                )
            );
            const satRes = await solver.checkSat();
            if (!satRes.satisfiable) {
                found.push({
                    prerequisite: others,
                    consequence: rule,
                });
                base = others;
                foundOne = true;
                break;
            }
        }
    } while (foundOne);

    return found.sort(
        (f1, f2) => f1.prerequisite.length - f2.prerequisite.length
    );
}
