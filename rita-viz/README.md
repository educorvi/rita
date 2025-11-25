# @educorvi/rita-viz

Visualization package for Rita rules. Converts Rita rule JSON to visual diagrams in various formats (PDF, SVG, PNG).

## Features

-   📊 Visualize Rita rules as flowchart-style diagrams
-   📄 Export to PDF, SVG, PNG, or DOT format
-   🖥️ Use as a CLI tool or programmatically
-   🎨 Color-coded node types for easy understanding
-   📦 Support for single rules or rule sets

## Installation

```bash
npm install @educorvi/rita-viz
```

## CLI Usage

```bash
# Visualize a rule to PDF (default)
rita-viz visualize rule.json -o output.pdf

# Visualize to SVG
rita-viz visualize rule.json -o output.svg -f svg

# Visualize to PNG with custom DPI
rita-viz visualize rule.json -o output.png -f png --dpi 600

# Generate DOT graph
rita-viz visualize rule.json -o output.dot -f dot

# Customize layout and title
rita-viz visualize rule.json -o output.pdf -t "My Rule" -d LR
```

### CLI Options

-   `-o, --output <path>` - Output file path (default: output.pdf)
-   `-f, --format <format>` - Output format: pdf, svg, png, dot (default: pdf)
-   `-t, --title <title>` - Title for the visualization
-   `-d, --direction <dir>` - Graph direction: TB (top-bottom) or LR (left-right) (default: TB)
-   `--dpi <number>` - DPI for PNG output (default: 300)

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

// Generate PDF
await viz.visualizeRuleToPDF(rule, 'output.pdf');

// Generate SVG
const svg = await viz.visualizeRuleToSVG(rule);

// Generate PNG
await viz.visualizeRuleToPNG(rule, 'output.png', undefined, 300);

// Visualize a rule set
const ruleSet: RuleSet = {
    rules: [rule1, rule2, rule3],
};
await viz.visualizeRuleSetToPDF(ruleSet, 'ruleset.pdf');
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

## Requirements

This package requires Graphviz to be installed on your system:

### Linux

```bash
sudo apt-get install graphviz
```

### macOS

```bash
brew install graphviz
```

### Windows

Download and install from [graphviz.org](https://graphviz.org/download/)

## API Reference

### RitaViz Class

Main class for visualizing rules.

#### Methods

-   `visualizeRule(rule: Rule, options?: VisualizationOptions): string` - Returns DOT graph string
-   `visualizeRuleSet(ruleSet: RuleSet, options?: VisualizationOptions): string` - Returns DOT graph string
-   `visualizeRuleToPDF(rule: Rule, outputPath: string, options?)` - Generates PDF file
-   `visualizeRuleSetToPDF(ruleSet: RuleSet, outputPath: string, options?)` - Generates PDF file
-   `visualizeRuleToSVG(rule: Rule, options?): Promise<string>` - Returns SVG string
-   `visualizeRuleSetToSVG(ruleSet: RuleSet, options?): Promise<string>` - Returns SVG string
-   `visualizeRuleToPNG(rule: Rule, outputPath: string, options?, dpi?)` - Generates PNG file
-   `visualizeRuleSetToPNG(ruleSet: RuleSet, outputPath: string, options?, dpi?)` - Generates PNG file

## License

MIT
