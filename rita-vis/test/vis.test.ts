import { visualize, visualizeInteractive } from '../src/index';
import { Parser } from '@educorvi/rita';

describe('Visualizer', () => {
    const parser = new Parser();
    const rules = parser.parseRuleSet({
        rules: [
            {
                id: 'test',
                rule: {
                    type: 'atom',
                    path: 'x',
                },
            },
        ],
    });

    it('should visualize a simple rule as SVG', () => {
        const svg = visualize(rules);
        expect(svg).toContain('<svg');
        expect(svg).toContain('Atom: x');
    });

    it('should visualize a simple rule as Interactive HTML', () => {
        const html = visualizeInteractive(rules);
        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('vis.Network');
        expect(html).toContain('"label":"x"');
    });
});
