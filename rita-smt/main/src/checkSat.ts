import { Rule } from '@educorvi/rita';
import SmtSolver from './SmtSolver';
import util from 'util';

export type CheckSatOpts = {
    timelimit?: number;
    verbose?: boolean;
    hideOutput?: boolean;
};

export async function checkSat(rp: Rule[], opts: CheckSatOpts = {}) {
    let s: SmtSolver;
    const { timelimit, verbose, hideOutput } = opts;
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

    if (!hideOutput || verbose) {
        console.log(
            util.inspect(res, {
                showHidden: false,
                depth: null,
                colors: true,
            })
        );
    }
    return res;
}
