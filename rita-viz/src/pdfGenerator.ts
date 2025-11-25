/**
 * PDF Generator for Rita rule visualizations
 * Converts DOT graphs to SVG and PDF formats using viz.js
 */

import { instance } from '@viz-js/viz';
import * as fs from 'fs';

export interface PDFGenerationOptions {
    /** Output file path for the PDF */
    outputPath: string;
    /** DPI for the output (default: 300) */
    dpi?: number;
}

/**
 * Generates various output formats from DOT graphs using viz.js
 */
export class PDFGenerator {
    private vizInstance: any = null;

    /**
     * Gets or initializes the viz.js instance
     */
    private async getViz(): Promise<any> {
        if (!this.vizInstance) {
            this.vizInstance = await instance();
        }
        return this.vizInstance;
    }

    /**
     * Converts DOT graph to PDF (currently generates SVG, as true PDF requires additional conversion)
     * @param dotGraph The DOT graph string
     * @param options PDF generation options
     * @returns Promise that resolves when file is generated
     */
    public async generatePDF(
        dotGraph: string,
        options: PDFGenerationOptions
    ): Promise<void> {
        // Generate SVG and save it
        // For true PDF, users can convert SVG using external tools or libraries
        const svg = await this.generateSVG(dotGraph);
        fs.writeFileSync(options.outputPath, svg);
    }

    /**
     * Converts DOT graph to SVG
     * @param dotGraph The DOT graph string
     * @returns Promise that resolves with the SVG string
     */
    public async generateSVG(dotGraph: string): Promise<string> {
        const viz = await this.getViz();
        return viz.renderString(dotGraph, { format: 'svg' });
    }

    /**
     * Converts DOT graph to PNG (generates SVG with note about PNG conversion)
     * @param dotGraph The DOT graph string
     * @param outputPath Output file path for the PNG
     * @param _dpi DPI for the output (not supported by viz.js)
     */
    public async generatePNG(
        dotGraph: string,
        outputPath: string,
        _dpi: number = 300
    ): Promise<void> {
        // viz.js doesn't directly support PNG, so we generate SVG
        const svg = await this.generateSVG(dotGraph);

        // Save as SVG - true PNG conversion would require additional dependencies
        const svgPath = outputPath.replace(/\.png$/i, '.svg');
        fs.writeFileSync(svgPath, svg);

        console.warn(
            `Note: PNG generation creates SVG files (${svgPath}). For PNG conversion, please use external tools like ImageMagick or rsvg-convert.`
        );
    }
}
