# Rita-Viz Examples

This directory contains example rule files that can be used with rita-viz.

## Usage

### CLI Examples

```bash
# Visualize a simple rule
rita-viz visualize simple-rule.json -o simple-rule.svg -f svg

# Visualize a rule set
rita-viz visualize rule-set.json -o rule-set.svg -f svg

# Generate DOT format
rita-viz visualize simple-rule.json -o simple-rule.dot -f dot

# Customize the visualization
rita-viz visualize rule-set.json -o rule-set-lr.svg -f svg -d LR -t "My Rules"
```

### Programmatic Examples

```javascript
import { RitaViz } from '@educorvi/rita-viz';
import * as fs from 'fs';

// Load a rule from file
const rule = JSON.parse(fs.readFileSync('simple-rule.json', 'utf-8'));

// Create visualizer
const viz = new RitaViz();

// Generate DOT graph
const dot = viz.visualizeRule(rule);
console.log(dot);

// Generate SVG
const svg = await viz.visualizeRuleToSVG(rule);
fs.writeFileSync('output.svg', svg);

// Load and visualize a rule set
const ruleSet = JSON.parse(fs.readFileSync('rule-set.json', 'utf-8'));
const ruleSetSvg = await viz.visualizeRuleSetToSVG(ruleSet, {
    title: 'User Validation Rules',
    direction: 'TB',
});
fs.writeFileSync('rule-set.svg', ruleSetSvg);
```

## Converting to PDF

To convert the generated SVG files to PDF, you can use one of these tools:

```bash
# Using Inkscape
inkscape simple-rule.svg --export-filename=simple-rule.pdf

# Using rsvg-convert (from librsvg)
rsvg-convert -f pdf -o simple-rule.pdf simple-rule.svg

# Using CairoSVG (Python)
cairosvg simple-rule.svg -o simple-rule.pdf
```

## Converting to PNG

To convert the generated SVG files to PNG:

```bash
# Using rsvg-convert (from librsvg)
rsvg-convert -o simple-rule.png simple-rule.svg

# Using ImageMagick
convert simple-rule.svg simple-rule.png

# Using CairoSVG (Python)
cairosvg simple-rule.svg -o simple-rule.png
```
