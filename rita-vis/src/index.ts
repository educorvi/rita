import { Rule } from '@educorvi/rita';
import { Visualizer } from './Visualizer';
import { GraphGenerator } from './GraphGenerator';
import { generateInteractiveHtml } from './InteractiveHtmlGenerator';

export * from './Visualizer';
export * from './HtmlGenerator';
export * from './GraphGenerator';
export * from './InteractiveHtmlGenerator';

export function visualize(rules: Rule[] | Rule): string {
    const vis = new Visualizer();
    if (Array.isArray(rules)) {
        return vis.visualizeRuleSet(rules);
    } else {
        return vis.visualizeRule(rules);
    }
}

export function visualizeInteractive(rules: Rule[] | Rule): string {
    const generator = new GraphGenerator();
    const data = generator.generateGraph(rules);
    return generateInteractiveHtml(data);
}
