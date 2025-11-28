import {
    And,
    Atom,
    Comparison,
    Formula,
    Not,
    Or,
    Quantifier,
    Rule,
} from '@educorvi/rita';
import { create } from 'xmlbuilder2';

interface NodeLayout {
    x: number;
    y: number;
    width: number;
    height: number;
    children: NodeLayout[];
    label: string;
    color: string;
    shape: 'rect' | 'circle' | 'diamond';
    id: number;
}

export class Visualizer {
    private nextId = 0;
    private nodeSpacingX = 20;
    private nodeSpacingY = 40;
    private nodeWidth = 100;
    private nodeHeight = 40;

    public visualizeRuleSet(rules: Rule[]): string {
        const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            version: '1.1',
        });

        let currentY = 0;
        let maxWidth = 0;

        const layouts: NodeLayout[] = [];

        for (const rule of rules) {
            this.nextId = 0; // Reset ID for each rule if we want isolated subtrees, but global ID is fine too
            const layout = this.calculateLayout(rule);
            // Shift layout down
            this.shiftLayout(layout, 0, currentY);
            layouts.push(layout);

            currentY += layout.height + 50; // Spacing between rules
            if (layout.width > maxWidth) maxWidth = layout.width;
        }

        root.att('width', maxWidth.toString());
        root.att('height', currentY.toString());
        root.att('viewBox', `0 0 ${maxWidth} ${currentY}`);

        // Background
        root.ele('rect', { width: '100%', height: '100%', fill: '#f0f0f0' });

        for (const layout of layouts) {
            this.renderLayout(root, layout);
        }

        return root.end({ prettyPrint: true });
    }

    public visualizeRule(rule: Rule): string {
        return this.visualizeRuleSet([rule]);
    }

    private calculateLayout(item: Formula | Rule): NodeLayout {
        const id = this.nextId++;
        let children: NodeLayout[] = [];
        let label = '';
        let color = '#ffffff';
        let shape: 'rect' | 'circle' | 'diamond' = 'rect';

        if (item instanceof Rule) {
            label = `Rule: ${item.id}`;
            color = '#e0e0ff';
            children.push(this.calculateLayout(item.rule));
        } else if (item instanceof And) {
            label = 'AND';
            color = '#ffcccc';
            shape = 'circle';
            children = item.arguments.map((arg) => this.calculateLayout(arg));
        } else if (item instanceof Or) {
            label = 'OR';
            color = '#ccffcc';
            shape = 'circle';
            children = item.arguments.map((arg) => this.calculateLayout(arg));
        } else if (item instanceof Not) {
            label = 'NOT';
            color = '#ffffcc';
            shape = 'circle';
            children = item.arguments.map((arg) => this.calculateLayout(arg));
        } else if (item instanceof Atom) {
            label = `Atom: ${item.path}`;
            color = '#ffffff';
        } else if (item instanceof Comparison) {
            label = `Comparison ${item.operation}`;
            color = '#eeeeee';
            // Arguments for comparison can be simple values or Formulas.
            // Visualizing them nicely is tricky. For now, treat complex ones as children.
            children = item.arguments
                .filter(
                    (arg) =>
                        arg instanceof Formula ||
                        (typeof arg === 'object' &&
                            arg !== null &&
                            'evaluate' in arg)
                )
                .map((arg) => this.calculateLayout(arg as Formula));
        } else if (item instanceof Quantifier) {
            label = `${item.quantifier} ${item.placeholder}`;
            color = '#ffddee';
            children.push(this.calculateLayout(item.formula));
        } else {
            label = 'Unknown';
        }

        // Simple Tree Layout Calculation
        // Width is sum of children widths + spacing, or min width
        let width = this.nodeWidth;
        let childrenWidth = 0;
        if (children.length > 0) {
            childrenWidth =
                children.reduce((sum, child) => sum + child.width, 0) +
                (children.length - 1) * this.nodeSpacingX;
            if (childrenWidth > width) width = childrenWidth;
        }

        const layout: NodeLayout = {
            x: 0, // Relative to subtree
            y: 0,
            width: width,
            height: this.nodeHeight, // Node itself
            children: children,
            label,
            color,
            shape,
            id,
        };

        // Reposition children
        let currentX = 0;
        // Center children under parent
        if (children.length > 0) {
            // If parent is wider than children, center the group of children
            // If children are wider, center parent

            const totalChildrenWidth = childrenWidth;
            let startX = (width - totalChildrenWidth) / 2;

            if (startX < 0) startX = 0; // Should not happen if width is max

            currentX = startX;
            let maxChildHeight = 0;

            for (const child of children) {
                child.x = currentX;
                child.y = this.nodeHeight + this.nodeSpacingY;

                currentX += child.width + this.nodeSpacingX;

                // Accumulate total height
                const childTotalHeight = this.getSubtreeHeight(child);
                if (childTotalHeight > maxChildHeight)
                    maxChildHeight = childTotalHeight;
            }
            layout.height += this.nodeSpacingY + maxChildHeight;
        }

        return layout;
    }

    private getSubtreeHeight(node: NodeLayout): number {
        return node.height;
    }

    private shiftLayout(layout: NodeLayout, dx: number, dy: number) {
        layout.x += dx;
        layout.y += dy;
        // Recursively shift is NOT needed because renderLayout handles local coordinates recursively?
        // NO. renderLayout is implemented recursively with passed offsetX/Y.
        // BUT, calculateLayout computes relative coordinates.
        // shiftLayout is used to position the root of the tree in the global SVG space.
        // Since renderLayout adds parent x/y to child x/y, we only need to shift the root.
        // renderLayout(root, layout, 0, 0) uses layout.x/y.
        // So yes, just shifting root is fine IF the children x/y are relative to parent.
        // My calculateLayout sets child.x relative to parent's left edge?
        // No, relative to parent's bounding box start.
        // And parent's width is calculated based on children.
        // So yes, relative.
    }

    private renderLayout(
        root: any,
        layout: NodeLayout,
        offsetX: number = 0,
        offsetY: number = 0
    ) {
        const x = offsetX + layout.x;
        const y = offsetY + layout.y;
        const cx = x + layout.width / 2;
        const cy = y + this.nodeHeight / 2; // Center of the node element

        // Draw connections to children
        for (const child of layout.children) {
            const childX = x + child.x; // relative to this node's box
            const childY = y + child.y;
            const childCx = childX + child.width / 2;
            // const childCy = childY + this.nodeHeight / 2;

            root.ele('line', {
                x1: cx,
                y1: cy + this.nodeHeight / 2,
                x2: childCx,
                y2: childY, // Connect to top of child bounding box (where child node starts)
                style: 'stroke:black;stroke-width:2',
            });

            this.renderLayout(root, child, x, y);
        }

        // Draw node
        const nodeGroup = root.ele('g', {
            transform: `translate(${
                x + layout.width / 2 - this.nodeWidth / 2
            }, ${y})`,
        });

        if (layout.shape === 'circle') {
            nodeGroup.ele('ellipse', {
                cx: this.nodeWidth / 2,
                cy: this.nodeHeight / 2,
                rx: this.nodeWidth / 2,
                ry: this.nodeHeight / 2,
                fill: layout.color,
                stroke: 'black',
            });
        } else {
            nodeGroup.ele('rect', {
                width: this.nodeWidth,
                height: this.nodeHeight,
                rx: 5,
                ry: 5,
                fill: layout.color,
                stroke: 'black',
            });
        }

        nodeGroup
            .ele('text', {
                x: this.nodeWidth / 2,
                y: this.nodeHeight / 2,
                'dominant-baseline': 'middle',
                'text-anchor': 'middle',
                'font-family': 'Arial',
                'font-size': '12',
            })
            .txt(
                layout.label.length > 15
                    ? layout.label.substring(0, 12) + '...'
                    : layout.label
            );
    }
}
