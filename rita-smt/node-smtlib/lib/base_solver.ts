// -*- mode: typescript; indent-tabs-mode: nil; js-basic-offset: 4 -*-
//
// Copyright 2017-2020 Giovanni Campagna <gcampagn@cs.stanford.edu>
//
// See LICENSE for details

import * as smt from './smtlib';

export type Model = Record<string, number | boolean | string>;

export type SatResult = {
    satisfieable: boolean;
    model: Model | undefined;
};

export default class BaseSmtSolver {
    private _statements: smt.SNode[];
    withAssignments: boolean;
    timeLimit: number;
    placeholders: string[] = [];
    public readonly output: string[] = [];

    constructor(logic = 'QF_ALL_SUPPORTED') {
        this._statements = [smt.SetLogic(logic)];

        this.withAssignments = false;
        this.timeLimit = 180000;
    }

    addPlaceholder(s: string) {
        this.placeholders.push(s);
    }

    isPlaceholder(s: string): boolean {
        return this.placeholders.includes(s);
    }

    enableAssignments(): void {
        this.withAssignments = true;
        this.add(smt.SetOption('produce-assignments'));
        this.add(smt.SetOption('produce-models'));
    }

    dump(f: (s: string) => void = console.log): void {
        for (const stmt of this._statements) f(stmt.toString());
    }

    forEachStatement(callback: (cb: smt.SNode, idx: number) => void): void {
        this._statements.forEach(callback);
    }

    checkSat(): Promise<SatResult> {
        throw new Error('checkSat not implemented for this solver');
    }

    add(stmt: smt.SNode): void {
        this._statements.push(stmt);
    }

    assert(expr: smt.SNode): void {
        this.add(smt.Assert(expr));
    }

    setOption(opt: string, value: smt.SNode = 'true'): void {
        this.add(smt.SetOption(opt, value));
    }

    declareFun(name: string, args: smt.SNode[], type: smt.SNode): void {
        this.add(smt.DeclareFun(name, args, type));
    }
}
