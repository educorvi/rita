import { Rule } from '@educorvi/rita';
import SmtSolver from './SmtSolver';

export type CheckSatOpts = {
    timelimit?: number;
    verbose?: boolean;
};

export async function checkSat(rp: Rule[], opts: CheckSatOpts = {}) {
    let s: SmtSolver;
    const { timelimit, verbose } = opts;
    try {
        s = new SmtSolver(
            true,
            // @ts-ignore
            Number.parseInt(timelimit)
        );
        for (const rule of rp) {
            s.assertRule(rule);
        }
    } catch (e) {
        console.error('There was an error while converting to SMT:', e);
        process.exit(-1);
    }

    if (verbose) {
        console.log('Generated SMT:');
        s.dump();
        console.log('\n');
    }

    const res = await s.checkSat();
    // @ts-ignore
    if (verbose) {
        console.log('Output of CVC5:');
        s.output.forEach((value) => console.log(value));
        console.log('\n');
    }

    return res;
}
