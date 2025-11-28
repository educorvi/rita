// -*- mode: typescript; indent-tabs-mode: nil; js-basic-offset: 4 -*-
//
// Copyright 2017-2020 Giovanni Campagna <gcampagn@cs.stanford.edu>
//
// See LICENSE for details

import * as child_process from 'child_process';

import * as smt from './smtlib';
import { SatResult } from './base_solver';
import LocalCVCSolver from './local_cvc';
import { SExpr, SNode } from './smtlib';

export default class LocalCVC5Solver extends LocalCVCSolver {
    constructor(logic?: string, timelimit?: number) {
        super(logic, timelimit);
    }
    checkSat(): Promise<SatResult> {
        return new Promise((callback, errback) => {
            this.add(smt.CheckSat());

            const child = this.spawnCVC();

            const stdout = this.setupIO(child);
            this.parseOutput(stdout, errback, callback, child);
        });
    }

    simplify(formula: SNode): Promise<string> {
        this.add(new SExpr('simplify', formula));

        const child = this.spawnCVC();

        const stdout = this.setupIO(child);
        return new Promise((resolve) => {
            stdout.on('data', (line: string) => {
                resolve(line);
            });
        });
    }

    protected spawnCVC() {
        const args = ['--lang', 'smt2.6'];
        if (this.timeLimit > 0) {
            args.push('--tlimit=' + this.timeLimit);
        }
        if (this.withAssignments) {
            args.push('--dump-models');
        }

        return child_process.spawn('cvc5', args);
    }
}
