# @educorvi/rita-viz

Visualization package for Rita rules. Converts Rita rule JSON to visual diagrams in SVG and DOT formats.

## Features

-   📊 Visualize Rita rules as flowchart-style diagrams
-   📄 Export to SVG or DOT format
-   🖥️ Use as a CLI tool or programmatically
-   🎨 Color-coded node types for easy understanding
-   📦 Support for single rules or rule sets
-   ✨ Pure JavaScript implementation using [viz.js](https://github.com/mdaines/viz-js) - no native dependencies!

## Installation

```bash
npm install @educorvi/rita-viz
```

## CLI Usage

```bash
# Visualize a rule to SVG (recommended)
rita-viz visualize rule.json -o output.svg -f svg

# Generate DOT graph
rita-viz visualize rule.json -o output.dot -f dot

# Customize layout and title
rita-viz visualize rule.json -o output.svg -t "My Rule" -d LR
```

### CLI Options

-   `-o, --output <path>` - Output file path
-   `-f, --format <format>` - Output format: svg, dot, pdf, png (default: pdf)
-   `-t, --title <title>` - Title for the visualization
-   `-d, --direction <dir>` - Graph direction: TB (top-bottom) or LR (left-right) (default: TB)

### Converting to PDF or PNG

This package generates SVG output natively. To convert to PDF or PNG, use external tools:

**PDF Conversion:**

```bash
# Using Inkscape
inkscape output.svg --export-filename=output.pdf

# Using rsvg-convert
rsvg-convert -f pdf -o output.pdf output.svg

# Using CairoSVG (Python)
cairosvg output.svg -o output.pdf
```

**PNG Conversion:**

```bash
# Using rsvg-convert
rsvg-convert -o output.png output.svg

# Using ImageMagick
convert output.svg output.png

# Using CairoSVG (Python)
cairosvg output.svg -o output.png
```

## Programmatic Usage

```typescript
import { RitaViz } from '@educorvi/rita-viz';
import type { Rule, RuleSet } from '@educorvi/rita-viz';

const viz = new RitaViz();

// Example rule
const rule: Rule = {
    id: 'myRule',
    comment: 'Example rule',
    rule: {
        type: 'and',
        arguments: [
            {
                type: 'atom',
                path: 'member',
            },
            {
                type: 'not',
                arguments: [
                    {
                        type: 'atom',
                        path: 'employee',
                    },
                ],
            },
        ],
    },
};

// Generate DOT graph
const dotGraph = viz.visualizeRule(rule);
console.log(dotGraph);

// Generate SVG
const svg = await viz.visualizeRuleToSVG(rule);
console.log(svg);

// Save to file
await viz.visualizeRuleToPDF(rule, 'output.svg'); // Despite the name, this saves as SVG

// Visualize a rule set
const ruleSet: RuleSet = {
    rules: [rule1, rule2, rule3],
};
const svg = await viz.visualizeRuleSetToSVG(ruleSet);
```

## Visualization Options

```typescript
const options = {
    title: 'My Custom Title',
    direction: 'LR', // or 'TB' for top-to-bottom
};

const dotGraph = viz.visualizeRule(rule, options);
```

## Node Types and Colors

The visualization uses different shapes and colors for different node types:

-   **AND/OR/NOT operators** - Diamonds (blue/red/orange)
-   **Atoms** - Rounded boxes (green)
-   **Comparisons** - Ellipses (purple)
-   **Calculations** - Ellipses (cyan)
-   **Date Calculations** - Ellipses (brown)
-   **Quantifiers** - Hexagons (purple)
-   **Literals** - Rounded boxes (yellow)
-   **Plugins** - Double octagons (dark green)

## API Reference

### RitaViz Class

Main class for visualizing rules.

#### Methods

-   `visualizeRule(rule: Rule, options?: VisualizationOptions): string` - Returns DOT graph string
-   `visualizeRuleSet(ruleSet: RuleSet, options?: VisualizationOptions): string` - Returns DOT graph string
-   `visualizeRuleToPDF(rule: Rule, outputPath: string, options?)` - Generates SVG file
-   `visualizeRuleSetToPDF(ruleSet: RuleSet, outputPath: string, options?)` - Generates SVG file
-   `visualizeRuleToSVG(rule: Rule, options?): Promise<string>` - Returns SVG string
-   `visualizeRuleSetToSVG(ruleSet: RuleSet, options?): Promise<string>` - Returns SVG string

## Why viz.js?

This package uses [viz.js](https://github.com/mdaines/viz-js), a pure JavaScript/WebAssembly implementation of Graphviz. This means:

-   ✅ No native dependencies to install
-   ✅ Works in any environment (Node.js, browsers, Docker, etc.)
-   ✅ Consistent behavior across platforms
-   ✅ Easy to install and deploy

For PDF/PNG output, we recommend using well-established conversion tools post-generation, which gives you full control over the conversion process and output quality.

## License

MIT
