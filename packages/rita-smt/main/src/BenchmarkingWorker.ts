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
    Parser,
    Rule,
} from '@educorvi/rita';
import util from 'util';

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

function createPolynomString(degree: number): (x: number) => string {
    if (degree < 0) {
        throw new Error('Degree must be at least 0');
    } else if (degree === 0) {
        return () => 'a0';
    } else {
        return (x) =>
            `a_${degree}*${x}^${degree}+${createPolynomString(degree - 1)(x)}`;
    }
}

function createSystemOfEquations(degree: number): Rule[] {
    const polFunc = createPolynom(degree);
    const polStringFunc = createPolynomString(degree);
    const rules: Rule[] = [];
    for (let i = 0; i < degree; i++) {
        const point = [i, 0];
        // const point = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
        rules.push(
            new Rule(
                'e' + i,
                new Comparison(
                    [point[1], polFunc(point[0])],
                    comparisons.equal
                ),
                `${point[1]}=${polStringFunc(point[0])}`
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
        rules.push(new Rule('zero_cond', noZeros, 'for n>0: a_n != 0'));
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
    rules.push(new Rule('limits', limits, '-1000<a_n<1000'));
    return rules;
}

function createLineEquation(
    point: [x: number, y: number],
    varIndex: number,
    ruleIndex: number
): Rule {
    return new Rule(
        `g${varIndex}_${ruleIndex}`,
        new Comparison(
            [
                point[1],
                new Calculation(
                    [
                        new Calculation(
                            [new Atom('m' + varIndex), point[0]],
                            operations.multiply
                        ),
                        new Atom('t' + varIndex),
                    ],
                    operations.add
                ),
            ],
            comparisons.equal
        ),
        `${point[1]}=m_${varIndex}*${point[0]}+t`
    );
}

function createNLineEquations(n: number, simplifiable = false): Rule[] {
    const ret: Rule[] = [];
    const point1g: [x: number, y: number] = [
        Math.floor(Math.random() * 300),
        Math.floor(Math.random() * 300),
    ];
    const point2g: [x: number, y: number] = [
        Math.floor(Math.random() * 300),
        Math.floor(Math.random() * 300),
    ];
    if (point1g[0] === point2g[0]) point2g[0]--;
    for (let i = 0; i < n; i++) {
        const point1: [x: number, y: number] = [
            Math.floor(Math.random() * 300),
            Math.floor(Math.random() * 300),
        ];
        const point2: [x: number, y: number] = [
            Math.floor(Math.random() * 300),
            Math.floor(Math.random() * 300),
        ];
        if (point1[0] === point2[0]) point2[0]--;
        if (simplifiable) {
            ret.push(createLineEquation(point1g, 0, 0));
            ret.push(createLineEquation(point2g, 0, 1));
        } else {
            ret.push(createLineEquation(point1, i, 0));
            ret.push(createLineEquation(point2, i, 1));
        }
    }
    return ret;
}

async function run() {
    const { degree, opts } = workerData;
    let eqs;
    if (opts.lineEquations) {
        eqs = createNLineEquations(degree, opts.simplifiable);
    } else {
        eqs = createSystemOfEquations(degree);
    }

    if (opts.verbose) {
        console.log(
            util.inspect(Parser.toJson(eqs), {
                showHidden: false,
                depth: null,
                colors: true,
            })
        );
    }

    let start = new Date();
    const sat = (await checkSat(eqs, { ...opts, hideOutput: true }))
        .satisfiable;
    let end = new Date();
    if (!sat) {
        console.warn('Not satisfiable!');
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
