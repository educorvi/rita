import { BaseSolver, SatResult } from './index';
import { ChildProcessWithoutNullStreams } from 'child_process';
import byline from 'byline';
import bl from 'byline';
import { Model } from './base_solver';

export default abstract class LocalCVCSolver extends BaseSolver {
    protected constructor(logic: string) {
        super(logic);
        this.setOption('strings-exp');
    }

    protected abstract spawnCVC(): ChildProcessWithoutNullStreams;

    protected setupIO(child: ChildProcessWithoutNullStreams) {
        child.stdin.setDefaultEncoding('utf8');
        this.forEachStatement((stmt) => child.stdin.write(stmt.toString()));
        child.stdin.end();
        child.stderr.setEncoding('utf8');
        const stderr = byline(child.stderr);
        stderr.on('data', (data: string) => {
            console.error('SMT-ERR:', data);
        });
        child.stdout.setEncoding('utf8');
        return byline(child.stdout);
    }

    protected parseOutput(
        stdout: bl.LineStream,
        errback: (reason?: any) => void,
        callback: (value: PromiseLike<SatResult> | SatResult) => void,
        child: ChildProcessWithoutNullStreams
    ) {
        let sat: boolean | undefined = undefined;
        const assignment: Model = {};
        let cidx = 0;
        const constants: Record<string, number> = {};
        stdout.on('data', (line: string) => {
            this.output.push(line);
            if (line === 'sat') {
                sat = true;
                return;
            }
            if (line === 'unsat') {
                sat = false;
                return;
            }
            if (line === 'unknown') {
                sat = true;
                console.error('SMT TIMED OUT');
                this.dump();
                return;
            }
            if (line.startsWith('(error')) {
                errback(new Error('SMT error: ' + line));
                return;
            }

            const CONSTANT_REGEX = /; rep: @uc_([A-Za-z0-9_]+)$/;
            let match = CONSTANT_REGEX.exec(line);
            if (match !== null) {
                if (this.isPlaceholder(match[1])) return;
                constants[match[1]] = cidx++;
                return;
            }
            const ASSIGN_CONST_REGEX =
                /\(define-fun ([A-Za-z0-9_.]+) \(\) ([A-Za-z0-9_]+) @uc_([A-Za-z0-9_]+)\)$/;
            match = ASSIGN_CONST_REGEX.exec(line);
            if (match !== null) {
                if (this.isPlaceholder(match[1])) return;
                assignment[match[1]] = constants[match[3]];
                return;
            }
            const ASSIGN_NUMBER_REGEX =
                /\(define-fun ([A-Za-z0-9_.]+) \(\) Real (\d+\.\d+)\)$/;
            match = ASSIGN_NUMBER_REGEX.exec(line);
            if (match !== null) {
                if (this.isPlaceholder(match[1])) return;
                assignment[match[1]] = Number.parseFloat(match[2]);
                return;
            }

            const ASSIGN_FLOAT_REGEX =
                /\(define-fun ([A-Za-z0-9_.]+) \(\) Real \(\/ (\d+) (\d+)\)\)$/;
            match = ASSIGN_FLOAT_REGEX.exec(line);
            if (match !== null) {
                if (this.isPlaceholder(match[1])) return;
                assignment[match[1]] =
                    Number.parseFloat(match[2]) / Number.parseFloat(match[3]);
                return;
            }

            const ASSIGN_BOOL_REGEX =
                /\(define-fun ([A-Za-z0-9_.]+) \(\) Bool (true|false)\)$/;
            match = ASSIGN_BOOL_REGEX.exec(line);
            if (match !== null) {
                if (this.isPlaceholder(match[1])) return;
                assignment[match[1]] = match[2] === 'true';
            }

            const ASSIGN_STRING_REGEX =
                /\(define-fun ([A-Za-z0-9_.]+) \(\) String "(.*)"\)$/;
            match = ASSIGN_STRING_REGEX.exec(line);
            if (match !== null) {
                if (this.isPlaceholder(match[1])) return;
                assignment[match[1]] = match[2];
            }

            // ignore everything else
        });
        stdout.on('end', () => {
            // console.log('SMT elapsed time: ' + ((new Date).getTime() - now.getTime()));
            if (sat) callback({ satisfieable: true, model: assignment });
            else callback({ satisfieable: false, model: undefined });
        });

        child.stdout.on('error', errback);
    }
}
