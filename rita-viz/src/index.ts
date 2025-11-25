/**
 * Rita Visualization Package
 * Provides tools to visualize rita rules as diagrams
 */

export { RuleVisualizer, VisualizationOptions } from './visualizer.js';
export { PDFGenerator, PDFGenerationOptions } from './pdfGenerator.js';

// Re-export Rule and Formula from rita-core for convenience
import * as RitaCore from '@educorvi/rita';
export const { Rule, Formula } = RitaCore as any;

import { RuleVisualizer, VisualizationOptions } from './visualizer.js';
import { PDFGenerator, PDFGenerationOptions } from './pdfGenerator.js';

/**
 * High-level API for visualizing rules
 */
export class RitaViz {
    private visualizer: RuleVisualizer;
    private pdfGenerator: PDFGenerator;

    constructor() {
        this.visualizer = new RuleVisualizer();
        this.pdfGenerator = new PDFGenerator();
    }

    /**
     * Visualizes a single rule and returns DOT graph
     * @param rule The rule to visualize
     * @param options Visualization options
     * @returns DOT graph string
     */
    public visualizeRule(rule: any, options?: VisualizationOptions): string {
        return this.visualizer.generateDot(rule, options);
    }

    /**
     * Visualizes a rule set and returns DOT graph
     * @param rules Array of rules to visualize
     * @param options Visualization options
     * @returns DOT graph string
     */
    public visualizeRuleSet(
        rules: any[],
        options?: VisualizationOptions
    ): string {
        return this.visualizer.generateDotForRuleSet(rules, options);
    }

    /**
     * Visualizes a rule and saves it as a PDF
     * @param rule The rule to visualize
     * @param outputPath Path where the PDF should be saved
     * @param visualizationOptions Visualization options
     * @param pdfOptions PDF generation options
     */
    public async visualizeRuleToPDF(
        rule: any,
        outputPath: string,
        visualizationOptions?: VisualizationOptions,
        pdfOptions?: Omit<PDFGenerationOptions, 'outputPath'>
    ): Promise<void> {
        const dotGraph = this.visualizeRule(rule, visualizationOptions);
        await this.pdfGenerator.generatePDF(dotGraph, {
            ...pdfOptions,
            outputPath,
        });
    }

    /**
     * Visualizes a rule set and saves it as a PDF
     * @param rules Array of rules to visualize
     * @param outputPath Path where the PDF should be saved
     * @param visualizationOptions Visualization options
     * @param pdfOptions PDF generation options
     */
    public async visualizeRuleSetToPDF(
        rules: any[],
        outputPath: string,
        visualizationOptions?: VisualizationOptions,
        pdfOptions?: Omit<PDFGenerationOptions, 'outputPath'>
    ): Promise<void> {
        const dotGraph = this.visualizeRuleSet(rules, visualizationOptions);
        await this.pdfGenerator.generatePDF(dotGraph, {
            ...pdfOptions,
            outputPath,
        });
    }

    /**
     * Visualizes a rule and returns SVG
     * @param rule The rule to visualize
     * @param options Visualization options
     * @returns SVG string
     */
    public async visualizeRuleToSVG(
        rule: any,
        options?: VisualizationOptions
    ): Promise<string> {
        const dotGraph = this.visualizeRule(rule, options);
        return this.pdfGenerator.generateSVG(dotGraph);
    }

    /**
     * Visualizes a rule set and returns SVG
     * @param rules Array of rules to visualize
     * @param options Visualization options
     * @returns SVG string
     */
    public async visualizeRuleSetToSVG(
        rules: any[],
        options?: VisualizationOptions
    ): Promise<string> {
        const dotGraph = this.visualizeRuleSet(rules, options);
        return this.pdfGenerator.generateSVG(dotGraph);
    }

    /**
     * Visualizes a rule and saves it as PNG
     * @param rule The rule to visualize
     * @param outputPath Path where the PNG should be saved
     * @param visualizationOptions Visualization options
     * @param dpi DPI for the output (default: 300)
     */
    public async visualizeRuleToPNG(
        rule: any,
        outputPath: string,
        visualizationOptions?: VisualizationOptions,
        dpi?: number
    ): Promise<void> {
        const dotGraph = this.visualizeRule(rule, visualizationOptions);
        await this.pdfGenerator.generatePNG(dotGraph, outputPath, dpi);
    }

    /**
     * Visualizes a rule set and saves it as PNG
     * @param rules Array of rules to visualize
     * @param outputPath Path where the PNG should be saved
     * @param visualizationOptions Visualization options
     * @param dpi DPI for the output (default: 300)
     */
    public async visualizeRuleSetToPNG(
        rules: any[],
        outputPath: string,
        visualizationOptions?: VisualizationOptions,
        dpi?: number
    ): Promise<void> {
        const dotGraph = this.visualizeRuleSet(rules, visualizationOptions);
        await this.pdfGenerator.generatePNG(dotGraph, outputPath, dpi);
    }
}
