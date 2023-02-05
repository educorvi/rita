import { isMainThread, parentPort, workerData } from 'worker_threads';
import { checkSat } from './checkSat';
import { findImplications } from './simplify';
import {
    And,
    Atom,
    Calculation,
    Comparison,
    comparisons,
    Formula,
    Not,
    operations,
    Rule,
} from '@educorvi/rita';

function createPolynom(degree: number): (x: number) => Calculation | Atom {
    if (degree < 0) {
        throw new Error('Degree must be at least 0');
    } else if (degree === 0) {
        return () => new Atom('a0');
    } else {
        return (x) =>
            new Calculation(
                [
                    new Calculation(
                        [new Atom('a' + degree), Math.pow(x, degree)],
                        operations.multiply
                    ),
                    createPolynom(degree - 1)(x),
                ],
                operations.add
            );
    }
}

function createSystemOfEquations(degree: number): Rule[] {
    const polFunc = createPolynom(degree);
    const rules: Rule[] = [];
    for (let i = 0; i < degree; i++) {
        const point = [i, 0];
        // const point = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
        rules.push(
            new Rule(
                'e' + i,
                new Comparison([point[1], polFunc(point[0])], comparisons.equal)
            )
        );
    }
    if (degree > 0) {
        let noZeros: Formula = new Not([
            new Comparison([0, new Atom('a' + 1)], comparisons.equal),
        ]);
        for (let i = 2; i <= degree; i++) {
            noZeros = new And([
                new Not([
                    new Comparison([0, new Atom('a' + i)], comparisons.equal),
                ]),
                noZeros,
            ]);
        }
        rules.push(new Rule('zero_cond', noZeros));
    }

    let limits: Formula = new And([
        new Comparison([1000, new Atom('a' + 0)], comparisons.greater),
        new Comparison([-1000, new Atom('a' + 0)], comparisons.smaller),
    ]);
    for (let i = 1; i <= degree; i++) {
        limits = new And([
            new And([
                new Comparison([1000, new Atom('a' + i)], comparisons.greater),
                new Comparison([-1000, new Atom('a' + i)], comparisons.smaller),
            ]),
            limits,
        ]);
    }
    rules.push(new Rule('limits', limits));
    return rules;
}

async function run() {
    const { degree, opts } = workerData;
    const eqs = createSystemOfEquations(degree);

    let start = new Date();
    const sat = (await checkSat(eqs, { ...opts, hideOutput: true }))
        .satisfiable;
    let end = new Date();
    if (!sat) {
        console.warn('Not satisfied!');
    }
    const timeSat = end.getTime() - start.getTime();

    start = new Date();
    if (!opts.noImp) {
        await findImplications(eqs);
    }
    end = new Date();
    const timeImp = end.getTime() - start.getTime();

    if (parentPort) {
        parentPort.postMessage({ degree, timeSat, timeImp, sat });
    } else {
        throw new Error('parent Port undefined');
    }
}

if (!isMainThread) {
    run();
} else {
    throw new Error('Worker file should not be run from mainThread!');
}
