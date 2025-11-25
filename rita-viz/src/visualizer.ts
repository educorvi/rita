/**
 * Visualizer for Rita rules
 * Converts rule JSON to a visual representation
 */

export interface VisualizationOptions {
    /** Title for the visualization */
    title?: string;
    /** Direction of graph layout: TB (top to bottom), LR (left to right) */
    direction?: 'TB' | 'LR';
}

export interface Rule {
    id: string;
    comment?: string;
    rule: Formula;
}

export interface RuleSet {
    rules: Rule[];
}

export type Formula =
    | Operator
    | Atom
    | Comparison
    | Quantifier
    | Plugin
    | Calculation
    | DateCalculation;

export interface Operator {
    type: 'and' | 'or' | 'not';
    arguments: Formula[];
}

export interface Atom {
    type: 'atom';
    path: string;
    isDate?: boolean;
    default?: any;
}

export interface Comparison {
    type: 'comparison';
    operation:
        | 'greater'
        | 'smaller'
        | 'greaterOrEqual'
        | 'smallerOrEqual'
        | 'equal';
    arguments: any[];
    dates?: boolean;
}

export interface Quantifier {
    type: 'quantifier';
    operation: 'all' | 'atLeastOne';
    dataSource: any;
    iteratorName: string;
    arguments: Formula[];
}

export interface Plugin {
    type: 'plugin';
    [key: string]: any;
}

export interface Calculation {
    type: 'calculation';
    operation: string;
    arguments: any[];
}

export interface DateCalculation {
    type: 'dateCalculation';
    operation: string;
    arguments: any[];
    dateResultUnit?: string;
    dateCalculationUnit?: string;
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
    private generateFormulaNode(formula: Formula, parentId?: string): string {
        const nodeId = this.createNodeId();

        if (
            (formula as Operator).type === 'and' ||
            (formula as Operator).type === 'or' ||
            (formula as Operator).type === 'not'
        ) {
            const op = formula as Operator;
            const label = op.type.toUpperCase();
            const color =
                op.type === 'and'
                    ? '#4A90E2'
                    : op.type === 'or'
                    ? '#E24A4A'
                    : '#F5A623';

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=diamond, style=filled, fillcolor="${color}", fontcolor=white, fontsize=14];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }

            // Process children
            op.arguments.forEach((arg) => {
                this.generateFormulaNode(arg, nodeId);
            });
        } else if ((formula as Atom).type === 'atom') {
            const atom = formula as Atom;
            const label = atom.path + (atom.isDate ? '\\n(date)' : '');
            this.dotLines.push(
                `  ${nodeId} [label="${this.escapeLabel(
                    label
                )}", shape=box, style=filled, fillcolor="#7ED321", fontsize=12];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }
        } else if ((formula as Comparison).type === 'comparison') {
            const comp = formula as Comparison;
            const operationSymbol = this.getComparisonSymbol(comp.operation);
            const label = operationSymbol + (comp.dates ? '\\n(dates)' : '');

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=ellipse, style=filled, fillcolor="#BD10E0", fontcolor=white, fontsize=12];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }

            // Process arguments
            comp.arguments.forEach((arg) => {
                this.generateArgumentNode(arg, nodeId);
            });
        } else if ((formula as Calculation).type === 'calculation') {
            const calc = formula as Calculation;
            const label = `CALC: ${calc.operation}`;

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=ellipse, style=filled, fillcolor="#50E3C2", fontsize=12];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }

            // Process arguments
            calc.arguments.forEach((arg) => {
                this.generateArgumentNode(arg, nodeId);
            });
        } else if ((formula as DateCalculation).type === 'dateCalculation') {
            const calc = formula as DateCalculation;
            const label = `DATE CALC: ${calc.operation}`;

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=ellipse, style=filled, fillcolor="#8B572A", fontcolor=white, fontsize=12];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }

            // Process arguments
            calc.arguments.forEach((arg) => {
                this.generateArgumentNode(arg, nodeId);
            });
        } else if ((formula as Quantifier).type === 'quantifier') {
            const quant = formula as Quantifier;
            const label = `${quant.operation.toUpperCase()}\\n(${
                quant.iteratorName
            })`;

            this.dotLines.push(
                `  ${nodeId} [label="${label}", shape=hexagon, style=filled, fillcolor="#9013FE", fontcolor=white, fontsize=12];`
            );

            if (parentId) {
                this.dotLines.push(`  ${parentId} -> ${nodeId};`);
            }

            // Process arguments
            quant.arguments.forEach((arg) => {
                this.generateFormulaNode(arg, nodeId);
            });
        } else if ((formula as Plugin).type === 'plugin') {
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
        if (typeof arg === 'object' && arg !== null && 'type' in arg) {
            // It's a formula
            this.generateFormulaNode(arg as Formula, parentId);
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
    public generateDot(rule: Rule, options: VisualizationOptions = {}): string {
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
        ruleSet: RuleSet,
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
        ruleSet.rules.forEach((rule, index) => {
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
