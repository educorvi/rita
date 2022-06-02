// -*- mode: typescript; indent-tabs-mode: nil; js-basic-offset: 4 -*-
//
// Copyright 2017-2020 Giovanni Campagna <gcampagn@cs.stanford.edu>
//
// See LICENSE for details

import * as child_process from 'child_process';

import * as smt from './smtlib';
import LocalCVCSolver from "./local_cvc";
import {SatResult} from "./base_solver";

/**
 * @deprecated
 */
export default class LocalCVC4Solver extends LocalCVCSolver {
    constructor(logic : string) {
        super(logic);
        this.setOption('strings-guess-model');
    }

    checkSat(): Promise<SatResult> {
        return new Promise((callback, errback) => {
            this.add(smt.CheckSat());

            const child = this.spawnCVC();

            const stdout = this.setupIO(child);
            this.parseOutput(stdout, errback, callback, child);
        });
    }

    protected spawnCVC() {
        const args = ['--lang', 'smt2.6', '--tlimit=' + this.timeLimit, '--cpu-time'];
        if (this.withAssignments)
            args.push('--dump-models');

        // const now = new Date;
        return child_process.spawn('cvc4', args);
    }


}
