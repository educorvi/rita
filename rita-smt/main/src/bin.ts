#!/usr/bin/env node

import SmtSolver from './SmtSolver';
import * as fs from 'fs';
import { Parser } from '@educorvi/rita';
import { program } from 'commander';
import commandExists from 'command-exists';
import { simplify } from './index';
import { findImplications } from './simplify';
import termkit from 'terminal-kit';

const parser = new Parser();

const term = termkit.terminal;

program.version(process.env.VERSION || '0.0.0');
program
    .argument('filepath', 'path to the file that contains the Rita ruleset')
    .option(
        '--verbose',
        'output more information, e.g. the generated smt and the output of the sat solver'
    );

program
    .command('checksat <filepath>')
    .description('check satisfiability of a ruleset')
    .action((filepath) => {
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
                    s = new SmtSolver(true);
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

                if (program.opts().verbose) {
                    console.log('Generated SMT:');
                    s.dump();
                    console.log('\n');
                }

                s.checkSat().then((res) => {
                    if (program.opts().verbose) {
                        console.log('Output of CVC5:');
                        s.output.forEach((value) => console.log(value));
                        console.log('\n');
                    }

                    console.log('Result:', res);
                });
            })
            .catch((e) => {
                if (program.opts().verbose) console.error(e);
                console.error('You need to have cvc5 installed');
                process.exit(-1);
            });
    });

program
    .command('simplify <filepath>')
    .description('simplify ruleset')
    .action((filepath) => {
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
                simplify(rp.map((r) => r.rule))
                    .then(console.log)
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
    .action((filepath) => {
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
                const progressBar = term.progressBar({
                    percent: true,
                    eta: true,
                });
                findImplications(rp, progressBar.update)
                    .then((res) => {
                        progressBar.stop();
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
