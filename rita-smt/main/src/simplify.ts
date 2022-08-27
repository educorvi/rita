import { Formula } from '@educorvi/rita';
import SmtSolver from './SmtSolver';
import { And, SNode } from '@educorvi/smtlib';

export default async function simplify(formulas: Array<Formula>) {
    const smt = new SmtSolver();
    const simplifiedSMT = await smt.simplify(
        formulas.reduce((previousValue: SNode, currentValue: Formula) => {
            return And(previousValue, smt.parseFormula(currentValue));
        }, 'true')
    );
    console.log(simplifiedSMT);

    return JSON.stringify({});
}
