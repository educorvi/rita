/**
 * Visualizer for Rita rules
 * Converts rule JSON to a visual representation
 */

import RitaCoreModule from '@educorvi/rita';

// Extract the classes we need
const RitaCore = RitaCoreModule as any;
const Formula = RitaCore.Formula;
const And = RitaCore.And;
const Or = RitaCore.Or;
const Not = RitaCore.Not;
const Atom = RitaCore.Atom;
const Comparison = RitaCore.Comparison;
const Quantifier = RitaCore.Quantifier;
const Calculation = RitaCore.Calculation;
const DateCalculation = RitaCore.DateCalculation;

export interface VisualizationOptions {
    /** Title for the visualization */
    title?: string;
    /** Direction of graph layout: TB (top to bottom), LR (left to right) */
    direction?: 'TB' | 'LR';
}

/**
 * Generates a DOT graph representation of a rule
 */
export class RuleVisualizer {
    private nodeCounter = 0;
    private dotLines: string[] = [];

    /**
     * Creates a new node ID
     */
    private createNodeId(): string {
        return `node${this.nodeCounter++}`;
    }

    /**
     * Escapes special characters for DOT labels
     */
    private escapeLabel(label: string): string {
        return label
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n');
    }

    /**
     * Generates a DOT representation for a formula
     */
    private generateFormulaNode(formula: any, parentId?: string): string {
        const nodeId = this.createNodeId();

        if (formula instanceof And) {
            const label = 'AND';
            const color = '#4A90E2';

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=diamond, style=filled, fillcolor="${color}", fontcolor=white, fontsize=14];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }

            // Process children
            formula.arguments.forEach((arg: any) => {
                this.generateFormulaNode(arg, nodeId);
            });
        } else if (formula instanceof Or) {
            const label = 'OR';
            const color = '#E24A4A';

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=diamond, style=filled, fillcolor="${color}", fontcolor=white, fontsize=14];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }

            // Process children
            formula.arguments.forEach((arg: any) => {
                this.generateFormulaNode(arg, nodeId);
            });
        } else if (formula instanceof Not) {
            const label = 'NOT';
            const color = '#F5A623';

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=diamond, style=filled, fillcolor="${color}", fontcolor=white, fontsize=14];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }

            // Process children
            formula.arguments.forEach((arg: any) => {
                this.generateFormulaNode(arg, nodeId);
            });
        } else if (formula instanceof Atom) {
            const label = formula.path + (formula.isDate ? '\\n(date)' : '');
            this.dotLines.push(
                `  ${nodeId} [label="${this.escapeLabel(
                    label
                )}", shape=box, style=filled, fillcolor="#7ED321", fontsize=12];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }
        } else if (formula instanceof Comparison) {
            const operationSymbol = this.getComparisonSymbol(formula.operation);
            const label = operationSymbol + (formula.dates ? '\\n(dates)' : '');

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=ellipse, style=filled, fillcolor="#BD10E0", fontcolor=white, fontsize=12];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }

            // Process arguments
            formula.arguments.forEach((arg: any) => {
                this.generateArgumentNode(arg, nodeId);
            });
        } else if (formula instanceof Calculation) {
            const label = `CALC: ${formula.operation}`;

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=ellipse, style=filled, fillcolor="#50E3C2", fontsize=12];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }

            // Process arguments
            formula.arguments.forEach((arg: any) => {
                this.generateArgumentNode(arg, nodeId);
            });
        } else if (formula instanceof DateCalculation) {
            const label = `DATE CALC: ${formula.operation}`;

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=ellipse, style=filled, fillcolor="#8B572A", fontcolor=white, fontsize=12];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }

            // Process arguments
            formula.arguments.forEach((arg: any) => {
                this.generateArgumentNode(arg, nodeId);
            });
        } else if (formula instanceof Quantifier) {
            const label = `${formula.quantifier.toUpperCase()}\\n(${
                formula.placeholder
            })`;

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=hexagon, style=filled, fillcolor="#9013FE", fontcolor=white, fontsize=12];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }

            // Process the formula
            this.generateFormulaNode(formula.formula, nodeId);
        } else {
            // Handle Plugin or other unknown formula types
            const label = 'PLUGIN';

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=doubleoctagon, style=filled, fillcolor="#417505", fontcolor=white, fontsize=12];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }
        }

        return nodeId;
    }

    /**
     * Generates a node for an argument (which might be a literal or a formula)
     */
    private generateArgumentNode(arg: any, parentId: string): void {
        if (arg instanceof Formula) {
            // It's a formula
            this.generateFormulaNode(arg, parentId);
        } else {
            // It's a literal value
            const nodeId = this.createNodeId();
            const label = String(arg);
            this.dotLines.push(
                `  ${nodeId} [label="${this.escapeLabel(
                    label
                )}", shape=box, style="filled,rounded", fillcolor="#F8E71C", fontsize=11];`
            );
            this.dotLines.push(`  ${parentId} -> ${nodeId};`);
        }
    }

    /**
     * Gets the symbol for a comparison operation
     */
    private getComparisonSymbol(operation: string): string {
        switch (operation) {
            case 'greater':
                return '>';
            case 'smaller':
                return '<';
            case 'greaterOrEqual':
                return '>=';
            case 'smallerOrEqual':
                return '<=';
            case 'equal':
                return '=';
            default:
                return operation;
        }
    }

    /**
     * Generates a DOT graph for a single rule
     */
    public generateDot(rule: any, options: VisualizationOptions = {}): string {
        this.nodeCounter = 0;
        this.dotLines = [];

        const direction = options.direction || 'TB';
        const title = options.title || rule.id;

        this.dotLines.push('digraph Rule {');
        this.dotLines.push(`  rankdir=${direction};`);
        this.dotLines.push('  node [fontname="Arial"];');
        this.dotLines.push('  edge [fontname="Arial"];');
        this.dotLines.push(`  labelloc="t";`);
        const titleText = rule.comment
            ? `${this.escapeLabel(title)}\\n${this.escapeLabel(rule.comment)}`
            : this.escapeLabel(title);
        this.dotLines.push(`  label="${titleText}";`);
        this.dotLines.push(`  fontsize=16;`);
        this.dotLines.push('');

        // Generate the root node
        this.generateFormulaNode(rule.rule);

        this.dotLines.push('}');

        return this.dotLines.join('\n');
    }

    /**
     * Generates a DOT graph for multiple rules
     */
    public generateDotForRuleSet(
        rules: any[],
        options: VisualizationOptions = {}
    ): string {
        const direction = options.direction || 'TB';
        const title = options.title || 'Rules';

        const allDotLines: string[] = [];
        allDotLines.push('digraph Rules {');
        allDotLines.push(`  rankdir=${direction};`);
        allDotLines.push('  node [fontname="Arial"];');
        allDotLines.push('  edge [fontname="Arial"];');
        allDotLines.push(`  labelloc="t";`);
        allDotLines.push(`  label="${this.escapeLabel(title)}";`);
        allDotLines.push(`  fontsize=18;`);
        allDotLines.push('');

        // Create a subgraph for each rule
        rules.forEach((rule, index) => {
            this.nodeCounter = 0;
            this.dotLines = [];

            allDotLines.push(`  subgraph cluster_${index} {`);
            const labelText = rule.comment
                ? `${this.escapeLabel(rule.id)}\\n${this.escapeLabel(
                      rule.comment
                  )}`
                : this.escapeLabel(rule.id);
            allDotLines.push(`    label="${labelText}";`);
            allDotLines.push(`    fontsize=14;`);
            allDotLines.push(`    style=filled;`);
            allDotLines.push(`    fillcolor="#f0f0f0";`);
            allDotLines.push('');

            this.generateFormulaNode(rule.rule);

            // Add the nodes from this rule to the subgraph
            this.dotLines.forEach((line) => {
                allDotLines.push(`  ${line}`);
            });

            allDotLines.push('  }');
            allDotLines.push('');
        });

        allDotLines.push('}');

        return allDotLines.join('\n');
    }
}
