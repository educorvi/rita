#!/usr/bin/env node

import * as fs from 'fs';
import { Parser, Rule } from '@educorvi/rita';
import { program } from 'commander';
import commandExists from 'command-exists';
import { findImplications, simplify } from './simplify';
import { benchmark } from './benchmark';
import { checkSat } from './checkSat';
import util from 'util';

// Create a parser for rulesets
const parser = new Parser();

/**
 * Check if CVC5 is installed
 */
async function checkCVC() {
    try {
        await commandExists('cvc5');
    } catch (e) {
        // @ts-ignore
        if (this.opts().verbose) console.error(e);
        console.error('You need to have cvc5 installed');
        process.exit(-1);
    }
}

/**
 * Reads a ruleset from a file
 * @param path Path of the file
 */
function readRulesetFromFile(path: string): Rule[] {
    let r;
    try {
        r = JSON.parse(fs.readFileSync(path, 'utf-8'));
    } catch (e) {
        console.error("Can't open file: " + path);
        process.exit(-1);
    }

    try {
        return parser.parseRuleSet(r);
    } catch (e) {
        console.error('Error while parsing:', e);
        process.exit(-1);
    }
}

/**
 * Logs an error and exits afterwards
 * @param e the error
 */
const logAndExit = (e: Error) => {
    console.error(e);
    process.exit(-1);
};

program.version(process.env.VERSION || '0.0.0');

/**
 * Checksat command
 * Checks for satisfiability of a ruleset
 */
program
    .command('checksat')
    .argument('filepath', 'path to the file that contains the Rita ruleset')
    .description('Check satisfiability of a ruleset')
    .option(
        '--timelimit <number>',
        'sets the timelimit for the smt solver in milliseconds. Default is 180000, 0 means no timelimit',
        '180000'
    )
    .option(
        '--verbose',
        'output more information, e.g. the generated smt and the output of the sat solver'
    )
    .action(async function (filepath) {
        await checkCVC();

        const rp = readRulesetFromFile(filepath);

        // Check satisfiability
        // @ts-ignore
        const res = await checkSat(rp, this.opts()).catch(logAndExit);
        console.log(
            util.inspect(res, {
                showHidden: false,
                depth: null,
                colors: true,
            })
        );
    });

/**
 * Simplify command
 * Removes unnecessary rules from a ruleset
 */
program
    .command('simplify')
    .argument('filepath', 'path to the file that contains the Rita ruleset')
    .description(
        'simplify ruleset by removing rules that are implied by others'
    )
    .action(async function (filepath) {
        await checkCVC();

        const rp = readRulesetFromFile(filepath);

        const res = await simplify(rp).catch(logAndExit);

        console.log(JSON.stringify(JSON.parse(Parser.toJson(res)), null, 2));
    });

program
    .command('checkimp')
    .argument('filepath', 'path to the file that contains the Rita ruleset')
    .description('check ruleset for rules that implicate each other')
    .action(async function (filepath) {
        await checkCVC();

        const rp = readRulesetFromFile(filepath);

        const res = await findImplications(rp).catch(logAndExit);

        console.log(
            res.map(
                (it) =>
                    `${it.prerequisite
                        .map((rule) => `"${rule.id}"`)
                        .join(' ∧ ')} => "${it.consequence.id}"`
            )
        );
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
        'Instead of solving polynoms, solve n line equations. n is maxEquationDegree'
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
        'output more information, e.g. the generated rulesets and smt code'
    )
    .option('--noImp', 'Skip Implication checking')
    .action(async function () {
        // @ts-ignore
        await benchmark(this.opts());
    });

program.parse();
