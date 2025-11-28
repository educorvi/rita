# @educorvi/rita-vis

A visualization tool for RITA rulesets.

## Usage

### Library

```typescript
import { visualize, visualizeInteractive } from '@educorvi/rita-vis';
import { Parser } from '@educorvi/rita';

const rules = new Parser().parseRuleSet(json);

// Get SVG
const svgContent = visualize(rules);

// Get Interactive HTML (using vis-network)
const htmlContent = visualizeInteractive(rules);
```

### CLI

```bash
# Output SVG
rita-vis ruleset.json -o output.svg

# Output Interactive HTML
rita-vis ruleset.json --html -o output.html
```

## Building

Run `rushx build` in this directory.
