import { CheckSatOpts } from './checkSat';
import { Worker } from 'worker_threads';
import * as fs from 'fs';

export type BenchmarkOptions = CheckSatOpts & {
    maxEquationDegree: number;
    statsFile: string;
    noImp: boolean;
    maxWorkers: number;
};
export type BenchmarkResult = {
    degree: number;
    timeSat: number;
    timeImp: number;
    sat: boolean;
}[];

export async function benchmark(opts: BenchmarkOptions): Promise<void> {
    return new Promise((resolve) => {
        let runningWorkers = 0,
            currDegree = 0;
        const results: BenchmarkResult = [];

        function addWorker(degree: number) {
            runningWorkers++;
            const worker = new Worker(__dirname + '/BenchmarkingWorker.js', {
                workerData: {
                    degree,
                    opts,
                },
            });
            worker.on('error', console.error);
            worker.on('exit', () => {
                runningWorkers--;
                if (currDegree <= opts.maxEquationDegree) {
                    addWorker(currDegree++);
                } else {
                    if (runningWorkers <= 0) {
                        if (fs.existsSync(opts.statsFile)) {
                            fs.unlinkSync(opts.statsFile);
                        }
                        const print: string[][] = [];
                        const headers = ['degree', 'timeSat', 'timeImp', 'sat'];
                        print.push(headers);
                        for (let a = 0; a <= opts.maxEquationDegree; a++) {
                            const result = results[a];
                            if (!result) {
                                console.warn(`Result ${a} is undefined`);
                                continue;
                            }
                            print.push([
                                result.degree.toString(),
                                result.timeSat.toString(),
                                result.timeImp.toString(),
                                result.sat.toString(),
                            ]);
                        }

                        const printString: string = print
                            .map((item) => item.join(';'))
                            .join('\n');
                        fs.writeFileSync(opts.statsFile, printString);
                        resolve();
                    }
                }
            });
            worker.on('message', (msg) => {
                console.log(msg);
                const { degree, timeSat, timeImp, sat } = msg;
                results[degree] = { degree, timeImp, timeSat, sat };
            });
        }

        console.info(`Running with ${opts.maxWorkers} threads...`);
        for (
            let i = 0;
            i < Math.min(opts.maxWorkers, opts.maxEquationDegree);
            i++
        ) {
            addWorker(currDegree++);
        }
    });
}
