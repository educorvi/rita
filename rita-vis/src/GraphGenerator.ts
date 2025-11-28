import {
    And,
    Atom,
    Comparison,
    Formula,
    Not,
    Or,
    Quantifier,
    Rule,
    Calculation,
    DateCalculation,
    Macro,
    Plugin,
} from '@educorvi/rita';

export interface Node {
    id: number;
    label: string;
    group?: string;
    title?: string; // Tooltip
    level?: number;
}

export interface Edge {
    from: number;
    to: number;
    label?: string;
    arrows?: string;
}

export interface GraphData {
    nodes: Node[];
    edges: Edge[];
}

export class GraphGenerator {
    private nextId = 1;
    private nodes: Node[] = [];
    private edges: Edge[] = [];

    public generateGraph(rules: Rule[] | Rule): GraphData {
        this.nextId = 1;
        this.nodes = [];
        this.edges = [];

        const ruleArray = Array.isArray(rules) ? rules : [rules];

        // Create a root node if multiple rules
        let rootId = -1;
        if (ruleArray.length > 1) {
            rootId = this.nextId++;
            this.nodes.push({
                id: rootId,
                label: 'Ruleset',
                group: 'root',
            });
        }

        for (const rule of ruleArray) {
            const ruleRootId = this.processNode(rule);
            if (rootId !== -1) {
                this.edges.push({ from: rootId, to: ruleRootId });
            }
        }

        return {
            nodes: this.nodes,
            edges: this.edges,
        };
    }

    private processNode(item: Formula | Rule): number {
        const id = this.nextId++;
        let label = '';
        let group = 'default';
        let tooltip = '';
        let children: (Formula | Rule)[] = [];

        if (item instanceof Rule) {
            label = `Rule: ${item.id}`;
            group = 'rule';
            tooltip = item.comment || '';
            children = [item.rule];
        } else if (item instanceof And) {
            label = 'AND';
            group = 'operator';
            children = item.arguments;
        } else if (item instanceof Or) {
            label = 'OR';
            group = 'operator';
            children = item.arguments;
        } else if (item instanceof Not) {
            label = 'NOT';
            group = 'operator';
            children = item.arguments;
        } else if (item instanceof Atom) {
            label = item.path;
            group = 'atom';
        } else if (item instanceof Comparison) {
            label = item.operation;
            group = 'comparison';
            // Handle arguments
            for (const arg of item.arguments) {
                if (arg instanceof Formula) {
                    children.push(arg);
                } else if (
                    typeof arg === 'object' &&
                    arg !== null &&
                    'evaluate' in arg
                ) {
                    // It's likely a formula if it has evaluate
                    children.push(arg as unknown as Formula);
                } else {
                    // Literal value, add as a leaf node
                    const leafId = this.nextId++;
                    this.nodes.push({
                        id: leafId,
                        label: String(arg),
                        group: 'literal',
                    });
                    this.edges.push({ from: id, to: leafId });
                }
            }
        } else if (item instanceof Quantifier) {
            label = `${item.quantifier} (${item.placeholder})`;
            group = 'quantifier';
            children = [item.formula];
            // Also visualize the array if it's a formula (Atom is a Formula)
            if (item.array instanceof Formula) {
                const arrayNodeId = this.processNode(item.array);
                this.edges.push({ from: id, to: arrayNodeId, label: 'in' });
            }
        } else if (item instanceof Calculation) {
            label = item.operation;
            group = 'calculation';
            for (const arg of item.arguments) {
                if (arg instanceof Formula) {
                    children.push(arg);
                } else {
                    const leafId = this.nextId++;
                    this.nodes.push({
                        id: leafId,
                        label: String(arg),
                        group: 'literal',
                    });
                    this.edges.push({ from: id, to: leafId });
                }
            }
        } else if (item instanceof DateCalculation) {
            label = item.operation;
            group = 'calculation';
            for (const arg of item.arguments) {
                if (arg instanceof Formula) {
                    children.push(arg);
                } else {
                    const leafId = this.nextId++;
                    this.nodes.push({
                        id: leafId,
                        label: String(arg),
                        group: 'literal',
                    });
                    this.edges.push({ from: id, to: leafId });
                }
            }
        } else if (item instanceof Macro) {
            label = `Macro`;
            group = 'macro';
        } else if (item instanceof Plugin) {
            label = `Plugin`;
            group = 'plugin';
        } else {
            label = 'Unknown';
        }

        this.nodes.push({
            id,
            label,
            group,
            title: tooltip,
        });

        for (const child of children) {
            const childId = this.processNode(child);
            this.edges.push({ from: id, to: childId });
        }

        return id;
    }
}
