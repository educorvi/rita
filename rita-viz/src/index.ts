/**
 * Rita Visualization Package
 * Provides tools to visualize rita rules as diagrams
 */

export {
    RuleVisualizer,
    VisualizationOptions,
    Rule,
    RuleSet,
    Formula,
} from './visualizer.js';
export { PDFGenerator, PDFGenerationOptions } from './pdfGenerator.js';

import {
    RuleVisualizer,
    Rule,
    RuleSet,
    VisualizationOptions,
} from './visualizer.js';
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
    public visualizeRule(rule: Rule, options?: VisualizationOptions): string {
        return this.visualizer.generateDot(rule, options);
    }

    /**
     * Visualizes a rule set and returns DOT graph
     * @param ruleSet The rule set to visualize
     * @param options Visualization options
     * @returns DOT graph string
     */
    public visualizeRuleSet(
        ruleSet: RuleSet,
        options?: VisualizationOptions
    ): string {
        return this.visualizer.generateDotForRuleSet(ruleSet, options);
    }

    /**
     * Visualizes a rule and saves it as a PDF
     * @param rule The rule to visualize
     * @param outputPath Path where the PDF should be saved
     * @param visualizationOptions Visualization options
     * @param pdfOptions PDF generation options
     */
    public async visualizeRuleToPDF(
        rule: Rule,
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
     * @param ruleSet The rule set to visualize
     * @param outputPath Path where the PDF should be saved
     * @param visualizationOptions Visualization options
     * @param pdfOptions PDF generation options
     */
    public async visualizeRuleSetToPDF(
        ruleSet: RuleSet,
        outputPath: string,
        visualizationOptions?: VisualizationOptions,
        pdfOptions?: Omit<PDFGenerationOptions, 'outputPath'>
    ): Promise<void> {
        const dotGraph = this.visualizeRuleSet(ruleSet, visualizationOptions);
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
        rule: Rule,
        options?: VisualizationOptions
    ): Promise<string> {
        const dotGraph = this.visualizeRule(rule, options);
        return this.pdfGenerator.generateSVG(dotGraph);
    }

    /**
     * Visualizes a rule set and returns SVG
     * @param ruleSet The rule set to visualize
     * @param options Visualization options
     * @returns SVG string
     */
    public async visualizeRuleSetToSVG(
        ruleSet: RuleSet,
        options?: VisualizationOptions
    ): Promise<string> {
        const dotGraph = this.visualizeRuleSet(ruleSet, options);
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
        rule: Rule,
        outputPath: string,
        visualizationOptions?: VisualizationOptions,
        dpi?: number
    ): Promise<void> {
        const dotGraph = this.visualizeRule(rule, visualizationOptions);
        await this.pdfGenerator.generatePNG(dotGraph, outputPath, dpi);
    }

    /**
     * Visualizes a rule set and saves it as PNG
     * @param ruleSet The rule set to visualize
     * @param outputPath Path where the PNG should be saved
     * @param visualizationOptions Visualization options
     * @param dpi DPI for the output (default: 300)
     */
    public async visualizeRuleSetToPNG(
        ruleSet: RuleSet,
        outputPath: string,
        visualizationOptions?: VisualizationOptions,
        dpi?: number
    ): Promise<void> {
        const dotGraph = this.visualizeRuleSet(ruleSet, visualizationOptions);
        await this.pdfGenerator.generatePNG(dotGraph, outputPath, dpi);
    }
}
