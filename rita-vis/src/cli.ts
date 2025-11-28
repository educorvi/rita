#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import { Parser } from '@educorvi/rita';
import { visualize, visualizeInteractive } from './index';

const program = new Command();

program
    .name('rita-vis')
    .description('Visualize RITA rulesets')
    .argument('<file>', 'Path to the RITA ruleset JSON file')
    .option('-o, --output <file>', 'Output file', 'output.svg')
    .option('--html', 'Generate interactive HTML output')
    .action((file, options) => {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            const json = JSON.parse(content);

            const parser = new Parser();

            let rules;
            if (json.rules && Array.isArray(json.rules)) {
                rules = parser.parseRuleSet(json);
            } else {
                rules = [parser.parseRule(json)];
            }

            const isHtml = options.html || options.output.endsWith('.html');

            // Ensure extension is .html if not specified but --html is used
            if (options.output === 'output.svg' && options.html) {
                options.output = 'output.html';
            }

            let output;
            if (isHtml) {
                output = visualizeInteractive(rules);
            } else {
                output = visualize(rules);
            }

            fs.writeFileSync(options.output, output);
            console.log(`Visualization saved to ${options.output}`);
        } catch (e: any) {
            console.error('Error:', e.message);
            process.exit(1);
        }
    });

program.parse();
