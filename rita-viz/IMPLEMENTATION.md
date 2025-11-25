# Rita-Viz Package

## Summary

Successfully created a visualization package for Rita rules that can be used both as a CLI tool and programmatically.

## Implementation Details

### Technology Stack

-   **Visualization Engine**: [viz.js](https://github.com/mdaines/viz-js) - Pure JavaScript/WebAssembly implementation of Graphviz
-   **Graph Format**: DOT language for defining graph structure
-   **Output Formats**: SVG (native), DOT (native), PDF/PNG (via external conversion)
-   **CLI Framework**: Commander.js
-   **Build System**: TypeScript, integrated into Rush monorepo

### Key Features

1. **Visualization Types**:
    - Single rules
    - Rule sets (multiple rules with subgraphs)
2. **Node Types Supported**:

    - Operators (AND, OR, NOT) - diamond shapes
    - Atoms (data references) - rounded boxes
    - Comparisons - ellipses
    - Calculations - ellipses
    - Date Calculations - ellipses
    - Quantifiers - hexagons
    - Literals - rounded boxes
    - Plugins - double octagons

3. **Customization Options**:
    - Graph direction (TB/LR)
    - Custom titles
    - Comments on rules

### Architecture

```
rita-viz/
├── src/
│   ├── visualizer.ts      # Core DOT graph generation
│   ├── pdfGenerator.ts    # viz.js integration for SVG output
│   ├── index.ts           # Public API
│   └── cli.ts             # Command-line interface
├── test/
│   └── visualizer.test.ts # 12 unit tests
├── examples/
│   ├── simple-rule.json
│   ├── rule-set.json
│   └── README.md
└── README.md
```

### Usage

#### CLI

```bash
# Basic SVG generation
rita-viz visualize rule.json -o output.svg -f svg

# With customization
rita-viz visualize rule.json -o output.svg -f svg -t "My Rule" -d LR
```

#### Programmatic API

```javascript
import { RitaViz } from '@educorvi/rita-viz';

const viz = new RitaViz();
const svg = await viz.visualizeRuleToSVG(rule);
```

### Testing

-   12 unit tests covering all major functionality
-   Tests include: operators, comparisons, nested structures, escaping, etc.
-   All tests passing

### Dependencies

-   `@viz-js/viz`: ^3.10.0 - Visualization engine
-   `commander`: ^14.0.0 - CLI framework
-   `@educorvi/rita`: workspace:^5.4.4 - Type definitions

### Advantages of viz.js over native Graphviz

1. **No native dependencies** - Pure JavaScript/WASM
2. **Easy installation** - npm install only
3. **Cross-platform** - Works everywhere Node.js runs
4. **No external binaries** - Everything bundled
5. **Consistent behavior** - Same output on all platforms

### Future Enhancements (Optional)

-   Direct PDF generation using svg2pdf.js
-   Direct PNG generation using sharp or canvas
-   Interactive visualizations for web browsers
-   Mermaid diagram output as alternative format
-   Custom color schemes and themes

## Security Summary

-   No security vulnerabilities detected by CodeQL
-   No npm audit issues with current dependencies
-   All dependencies are well-maintained packages

## Conclusion

The rita-viz package successfully provides visualization capabilities for Rita rules with a clean API, comprehensive documentation, and no native dependencies. It integrates seamlessly into the existing Rita monorepo structure.
