#!/usr/bin/env node

import SmtSolver from './SmtSolver';
import * as fs from 'fs';
import { Parser } from '@educorvi/rita';
import { program } from 'commander';
import commandExists from 'command-exists';
import { simplify } from './index';
import { findImplications } from './simplify';
import termkit from 'terminal-kit';
import * as util from 'util';

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

                let s: SmtSolver;
                try {
                    s = new SmtSolver(
                        true,
                        // @ts-ignore
                        Number.parseInt(this.opts().timelimit)
                    );
                    for (const rule of rp) {
                        s.assertRule(rule);
                    }
                } catch (e) {
                    console.error(
                        'There was an error while converting to SMT:',
                        e
                    );
                    process.exit(-1);
                }

                // @ts-ignore
                if (this.opts().verbose) {
                    console.log('Generated SMT:');
                    s.dump();
                    console.log('\n');
                }

                s.checkSat().then((res) => {
                    // @ts-ignore
                    if (this.opts().verbose) {
                        console.log('Output of CVC5:');
                        s.output.forEach((value) => console.log(value));
                        console.log('\n');
                    }

                    console.log('Result:');
                    console.log(
                        util.inspect(res, {
                            showHidden: false,
                            depth: null,
                            colors: true,
                        })
                    );
                });
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
    .option('--no-progress', 'hide progress details')
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
                let progressBar: termkit.Terminal.ProgressBarController | null =
                    null;
                // @ts-ignore
                if (this.opts().progress) {
                    progressBar = term.progressBar({
                        percent: true,
                        eta: true,
                    });
                }
                simplify(
                    rp,
                    // @ts-ignore
                    this.opts().progress ? term : undefined,
                    progressBar?.update
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
    .option('--no-progress', 'hide progress details')
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
                let progressBar: termkit.Terminal.ProgressBarController | null =
                    null;
                // @ts-ignore
                if (this.opts().progress) {
                    progressBar = term.progressBar({
                        percent: true,
                        eta: true,
                    });
                }
                findImplications(rp, progressBar?.update)
                    .then((res) => {
                        progressBar?.stop();
                        term('\n');
                        console.log(
                            res.map(
                                (it) =>
                                    `${it.prerequisite
                                        .map((rule) => `"${rule.id}"`)
                                        .join(' ∧ ')} => ${it.consequence
                                        .map((rule) => `"${rule.id}"`)
                                        .join(' ∧ ')}`
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
program.parse();
