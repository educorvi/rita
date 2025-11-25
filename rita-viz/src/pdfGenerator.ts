/**
 * PDF Generator for Rita rule visualizations
 * Converts DOT graphs to PDF format
 */

import graphvizModule from 'graphviz';
const { graphviz } = graphvizModule as any;

export interface PDFGenerationOptions {
    /** Output file path for the PDF */
    outputPath: string;
    /** DPI for the output (default: 300) */
    dpi?: number;
}

/**
 * Generates a PDF from a DOT graph
 */
export class PDFGenerator {
    /**
     * Converts DOT graph to PDF
     * @param dotGraph The DOT graph string
     * @param options PDF generation options
     * @returns Promise that resolves when PDF is generated
     */
    public async generatePDF(
        dotGraph: string,
        options: PDFGenerationOptions
    ): Promise<void> {
        try {
            // Use graphviz to render DOT to PDF
            return new Promise<void>((resolve, reject) => {
                graphviz.parse(dotGraph, (graph: any) => {
                    graph.setGraphVizPath('/usr/bin');

                    graph.output(
                        'pdf',
                        options.outputPath,
                        (code: number, _stdout: string, stderr: string) => {
                            if (code !== 0) {
                                reject(
                                    new Error(
                                        `Graphviz failed with code ${code}: ${stderr}`
                                    )
                                );
                            } else {
                                resolve();
                            }
                        }
                    );
                });
            });
        } catch (error) {
            throw new Error(
                `Failed to generate PDF: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    /**
     * Converts DOT graph to SVG (as an alternative output format)
     * @param dotGraph The DOT graph string
     * @returns Promise that resolves with the SVG string
     */
    public async generateSVG(dotGraph: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            graphviz.parse(dotGraph, (graph: any) => {
                graph.setGraphVizPath('/usr/bin');

                graph.output(
                    'svg',
                    (data: string) => {
                        resolve(data);
                    },
                    (code: number, _stdout: string, stderr: string) => {
                        reject(
                            new Error(
                                `Graphviz failed with code ${code}: ${stderr}`
                            )
                        );
                    }
                );
            });
        });
    }

    /**
     * Converts DOT graph to PNG (as an alternative output format)
     * @param dotGraph The DOT graph string
     * @param outputPath Output file path for the PNG
     * @param dpi DPI for the output (default: 300)
     */
    public async generatePNG(
        dotGraph: string,
        outputPath: string,
        dpi: number = 300
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            graphviz.parse(dotGraph, (graph: any) => {
                graph.setGraphVizPath('/usr/bin');
                graph.set('dpi', dpi);

                graph.output(
                    'png',
                    outputPath,
                    (code: number, _stdout: string, stderr: string) => {
                        if (code !== 0) {
                            reject(
                                new Error(
                                    `Graphviz failed with code ${code}: ${stderr}`
                                )
                            );
                        } else {
                            resolve();
                        }
                    }
                );
            });
        });
    }
}
