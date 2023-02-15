#!/usr/bin/env node

import * as fs from 'fs';
import { Parser } from '@educorvi/rita';
import { program } from 'commander';
import commandExists from 'command-exists';
import { simplify } from './index';
import { findImplications } from './simplify';
import termkit from 'terminal-kit';
import { benchmark } from './benchmark';
import { checkSat } from './checkSat';

const parser = new Parser();

const term = termkit.terminal;

program.version(process.env.VERSION || '0.0.0');
program.argument('filepath', 'path to the file that contains the Rita ruleset');

program
    .command('checksat <filepath>')
    .description('check satisfiability of a ruleset')
    .option(
        '--timelimit <number>',
        'Sets the timelimit for the smt solver in milliseconds. Default is 180000, 0 means no timelimit',
        '180000'
    )
    .option(
        '--verbose',
        'output more information, e.g. the generated smt and the output of the sat solver'
    )
    .action(function (filepath) {
        commandExists('cvc5')
            .then(() => {
                let r;
                try {
                    r = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
                } catch (e) {
                    console.error("Can't open file: " + filepath);
                    process.exit(-1);
                }

                let rp;
                try {
                    rp = parser.parseRuleSet(r);
                } catch (e) {
                    console.error('Error while parsing:', e);
                    process.exit(-1);
                }

                // @ts-ignore
                checkSat(rp, this.opts());
            })
            .catch((e) => {
                // @ts-ignore
                if (this.opts().verbose) console.error(e);
                console.error('You need to have cvc5 installed');
                process.exit(-1);
            });
    });

program
    .command('simplify <filepath>')
    .description('simplify ruleset')
    .action(function (filepath) {
        commandExists('cvc5')
            .then(() => {
                let r;
                try {
                    r = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
                } catch (e) {
                    console.error("Can't open file: " + filepath);
                    process.exit(-1);
                }
                const rp = parser.parseRuleSet(r);
                simplify(
                    rp,
                    // @ts-ignore
                    this.opts().progress ? term : undefined
                )
                    .then((res) =>
                        console.log(
                            JSON.stringify(
                                JSON.parse(Parser.toJson(res)),
                                null,
                                2
                            )
                        )
                    )
                    .catch(console.error);
            })
            .catch(() => {
                console.error('You need to have cvc5 installed');
                process.exit(-1);
            });
    });

program
    .command('checkimp <filepath>')
    .description('check ruleset for rules that implicate each other')
    .action(function (filepath) {
        commandExists('cvc5')
            .then(() => {
                let r;
                try {
                    r = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
                } catch (e) {
                    console.error("Can't open file: " + filepath);
                    process.exit(-1);
                }
                const rp = parser.parseRuleSet(r);
                findImplications(rp)
                    .then((res) => {
                        console.log(
                            res.map(
                                (it) =>
                                    `${it.prerequisite
                                        .map((rule) => `"${rule.id}"`)
                                        .join(' ∧ ')} => "${it.consequence.id}"`
                            )
                        );
                    })
                    .catch(console.error);
            })
            .catch(() => {
                console.error('You need to have cvc5 installed');
                process.exit(-1);
            });
    });

program
    .command('benchmark')
    .description(
        'Benchmark the commands of this on tool on this machine. Runs the checkSat and checkImp iteratively from 0 to maxEquationDegree, measures the time needed and writes it to the statsFile.'
    )
    .option(
        '--maxEquationDegree <number>',
        'The degree of the used equation system',
        '20'
    )
    .option(
        '--lineEquations',
        'Instead of solving polynoms, solve n line equations. n is maxEquationDegree '
    )
    .option(
        '--simplifiable',
        'All equations are the same, so they become simplifiable. Only available for line equations.'
    )
    .option(
        '--maxWorkers <number>',
        'The maximum amount of parallel Workers',
        '4'
    )
    .option(
        '--timelimit <number>',
        'Sets the timelimit for the smt solver in milliseconds. Default is 180000, 0 means no timelimit',
        '180000'
    )
    .option(
        '--statsFile <path>',
        'output path for the stats file',
        './stats.csv'
    )
    .option(
        '--verbose',
        'output more information, e.g. the generated smt and the output of the sat solver'
    )
    .option('--noImp', 'Skip Implication checking')
    .action(function () {
        // @ts-ignore
        benchmark(this.opts());
    });

program.parse();
