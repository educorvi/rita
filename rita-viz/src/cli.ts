#!/usr/bin/env node

/**
 * CLI tool for visualizing Rita rules
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { RitaViz } from './index.js';
import RitaCoreModule from '@educorvi/rita';

const Parser = (RitaCoreModule as any).Parser;

const program = new Command();

program
    .name('rita-viz')
    .description('Visualize Rita rules as diagrams')
    .version('1.0.0');

program
    .command('visualize')
    .description('Visualize a rule or rule set')
    .argument('<input>', 'Input JSON file containing rules')
    .option('-o, --output <path>', 'Output file path (default: output.pdf)')
    .option(
        '-f, --format <format>',
        'Output format: pdf, svg, png, dot (default: pdf)',
        'pdf'
    )
    .option('-t, --title <title>', 'Title for the visualization')
    .option(
        '-d, --direction <dir>',
        'Graph direction: TB (top-bottom) or LR (left-right)',
        'TB'
    )
    .option('--dpi <number>', 'DPI for PNG output (default: 300)', '300')
    .action(async (input: string, options: any) => {
        try {
            // Read input file
            const inputPath = path.resolve(input);
            if (!fs.existsSync(inputPath)) {
                console.error(`Error: Input file not found: ${inputPath}`);
                process.exit(1);
            }

            const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

            // Parse rules using rita-core Parser
            const parser = new Parser();

            // Determine if it's a single rule or a rule set
            const isRuleSet =
                'rules' in inputData && Array.isArray(inputData.rules);

            let rules: any[];
            if (isRuleSet) {
                rules = parser.parseRuleSet(inputData);
            } else {
                rules = [parser.parseRule(inputData)];
            }

            const viz = new RitaViz();
            const visualizationOptions = {
                title: options.title,
                direction:
                    options.direction === 'LR'
                        ? ('LR' as const)
                        : ('TB' as const),
            };

            // Determine output path
            const format = options.format.toLowerCase();
            const defaultExtension = format === 'dot' ? 'dot' : format;
            const outputPath = options.output || `output.${defaultExtension}`;
            const resolvedOutputPath = path.resolve(outputPath);

            console.log(
                `Visualizing ${
                    isRuleSet ? 'rule set' : 'rule'
                } from ${inputPath}...`
            );

            if (format === 'dot') {
                // Generate DOT and save to file
                const dotGraph =
                    rules.length > 1
                        ? viz.visualizeRuleSet(rules, visualizationOptions)
                        : viz.visualizeRule(rules[0], visualizationOptions);

                fs.writeFileSync(resolvedOutputPath, dotGraph);
                console.log(`DOT graph saved to ${resolvedOutputPath}`);
            } else if (format === 'pdf') {
                // Generate PDF
                if (rules.length > 1) {
                    await viz.visualizeRuleSetToPDF(
                        rules,
                        resolvedOutputPath,
                        visualizationOptions
                    );
                } else {
                    await viz.visualizeRuleToPDF(
                        rules[0],
                        resolvedOutputPath,
                        visualizationOptions
                    );
                }
                console.log(`PDF saved to ${resolvedOutputPath}`);
            } else if (format === 'svg') {
                // Generate SVG
                const svg =
                    rules.length > 1
                        ? await viz.visualizeRuleSetToSVG(
                              rules,
                              visualizationOptions
                          )
                        : await viz.visualizeRuleToSVG(
                              rules[0],
                              visualizationOptions
                          );

                fs.writeFileSync(resolvedOutputPath, svg);
                console.log(`SVG saved to ${resolvedOutputPath}`);
            } else if (format === 'png') {
                // Generate PNG
                const dpi = parseInt(options.dpi, 10);
                if (rules.length > 1) {
                    await viz.visualizeRuleSetToPNG(
                        rules,
                        resolvedOutputPath,
                        visualizationOptions,
                        dpi
                    );
                } else {
                    await viz.visualizeRuleToPNG(
                        rules[0],
                        resolvedOutputPath,
                        visualizationOptions,
                        dpi
                    );
                }
                console.log(`PNG saved to ${resolvedOutputPath}`);
            } else {
                console.error(`Error: Unknown format: ${format}`);
                console.error('Supported formats: pdf, svg, png, dot');
                process.exit(1);
            }
        } catch (error) {
            console.error(
                'Error:',
                error instanceof Error ? error.message : String(error)
            );
            if (error instanceof Error && error.stack) {
                console.error('Stack trace:', error.stack);
            }
            process.exit(1);
        }
    });

program.parse();
