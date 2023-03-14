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

        // function to add multithreading worker
        function addWorker(degree: number) {
            runningWorkers++;
            const worker = new Worker(__dirname + '/BenchmarkingWorker.js', {
                workerData: {
                    degree,
                    opts,
                },
            });
            worker.on('error', console.error);
            // start a new worker wants this one finishes, if there is still stuff left to do. Keeps the number of concurrent workers steady.
            worker.on('exit', () => {
                runningWorkers--;
                if (currDegree <= opts.maxEquationDegree) {
                    addWorker(currDegree++);
                } else {
                    if (runningWorkers <= 0) {
                        // This is the last worker, print results to csv file
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
            // Worker calculated result
            worker.on('message', (msg) => {
                console.log(msg);
                const { degree, timeSat, timeImp, sat } = msg;
                results[degree] = { degree, timeImp, timeSat, sat };
            });
        }

        // Start workers
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
