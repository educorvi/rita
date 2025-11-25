import { RuleVisualizer } from '../src/visualizer';
import { Parser } from '@educorvi/rita';

describe('RuleVisualizer', () => {
    let visualizer: RuleVisualizer;
    let parser: Parser;

    beforeEach(() => {
        visualizer = new RuleVisualizer();
        parser = new Parser();
    });

    test('should generate DOT graph for simple atom rule', () => {
        const ruleJSON = {
            id: 'test1',
            rule: {
                type: 'atom',
                path: 'member',
            },
        };

        const rule = parser.parseRule(ruleJSON);
        const dot = visualizer.generateDot(rule);

        expect(dot).toContain('digraph Rule');
        expect(dot).toContain('member');
        expect(dot).toContain('shape=box');
    });

    test('should generate DOT graph for AND operator', () => {
        const ruleJSON = {
            id: 'test2',
            rule: {
                type: 'and',
                arguments: [
                    {
                        type: 'atom',
                        path: 'member',
                    },
                    {
                        type: 'atom',
                        path: 'employee',
                    },
                ],
            },
        };

        const rule = parser.parseRule(ruleJSON);
        const dot = visualizer.generateDot(rule);

        expect(dot).toContain('digraph Rule');
        expect(dot).toContain('AND');
        expect(dot).toContain('member');
        expect(dot).toContain('employee');
        expect(dot).toContain('shape=diamond');
    });

    test('should generate DOT graph for OR operator', () => {
        const ruleJSON = {
            id: 'test3',
            rule: {
                type: 'or',
                arguments: [
                    {
                        type: 'atom',
                        path: 'a',
                    },
                    {
                        type: 'atom',
                        path: 'b',
                    },
                ],
            },
        };

        const rule = parser.parseRule(ruleJSON);
        const dot = visualizer.generateDot(rule);

        expect(dot).toContain('OR');
        expect(dot).toContain('#E24A4A'); // OR color
    });

    test('should generate DOT graph for NOT operator', () => {
        const ruleJSON = {
            id: 'test4',
            rule: {
                type: 'not',
                arguments: [
                    {
                        type: 'atom',
                        path: 'member',
                    },
                ],
            },
        };

        const rule = parser.parseRule(ruleJSON);
        const dot = visualizer.generateDot(rule);

        expect(dot).toContain('NOT');
        expect(dot).toContain('#F5A623'); // NOT color
    });

    test('should generate DOT graph for comparison', () => {
        const ruleJSON = {
            id: 'test5',
            rule: {
                type: 'comparison',
                operation: 'greater',
                arguments: [5, 2],
            },
        };

        const rule = parser.parseRule(ruleJSON);
        const dot = visualizer.generateDot(rule);

        expect(dot).toContain('>');
        expect(dot).toContain('5');
        expect(dot).toContain('2');
        expect(dot).toContain('shape=ellipse');
    });

    test('should generate DOT graph with comparison symbols', () => {
        const operations = [
            { op: 'greater', symbol: '>' },
            { op: 'smaller', symbol: '<' },
            { op: 'greaterOrEqual', symbol: '>=' },
            { op: 'smallerOrEqual', symbol: '<=' },
            { op: 'equal', symbol: '=' },
        ];

        operations.forEach(({ op, symbol }) => {
            const ruleJSON = {
                id: `test_${op}`,
                rule: {
                    type: 'comparison',
                    operation: op,
                    arguments: [1, 2],
                },
            };

            const rule = parser.parseRule(ruleJSON);
            const dot = visualizer.generateDot(rule);
            expect(dot).toContain(symbol);
        });
    });

    test('should include title and comment in DOT graph', () => {
        const ruleJSON = {
            id: 'test6',
            comment: 'This is a test rule',
            rule: {
                type: 'atom',
                path: 'test',
            },
        };

        const rule = parser.parseRule(ruleJSON);
        const dot = visualizer.generateDot(rule, { title: 'Custom Title' });

        expect(dot).toContain('Custom Title');
        expect(dot).toContain('This is a test rule');
    });

    test('should support different graph directions', () => {
        const ruleJSON = {
            id: 'test7',
            rule: {
                type: 'atom',
                path: 'test',
            },
        };

        const rule = parser.parseRule(ruleJSON);

        const dotTB = visualizer.generateDot(rule, { direction: 'TB' });
        expect(dotTB).toContain('rankdir=TB');

        const dotLR = visualizer.generateDot(rule, { direction: 'LR' });
        expect(dotLR).toContain('rankdir=LR');
    });

    test('should generate DOT graph for rule set', () => {
        const ruleSetJSON = {
            rules: [
                {
                    id: 'rule1',
                    rule: {
                        type: 'atom',
                        path: 'a',
                    },
                },
                {
                    id: 'rule2',
                    rule: {
                        type: 'atom',
                        path: 'b',
                    },
                },
            ],
        };

        const rules = parser.parseRuleSet(ruleSetJSON);
        const dot = visualizer.generateDotForRuleSet(rules);

        expect(dot).toContain('digraph Rules');
        expect(dot).toContain('subgraph cluster_0');
        expect(dot).toContain('subgraph cluster_1');
        expect(dot).toContain('rule1');
        expect(dot).toContain('rule2');
    });

    test('should handle nested operators', () => {
        const ruleJSON = {
            id: 'nested',
            rule: {
                type: 'and',
                arguments: [
                    {
                        type: 'atom',
                        path: 'a',
                    },
                    {
                        type: 'or',
                        arguments: [
                            {
                                type: 'atom',
                                path: 'b',
                            },
                            {
                                type: 'atom',
                                path: 'c',
                            },
                        ],
                    },
                ],
            },
        };

        const rule = parser.parseRule(ruleJSON);
        const dot = visualizer.generateDot(rule);

        expect(dot).toContain('AND');
        expect(dot).toContain('OR');
        expect(dot).toContain('a');
        expect(dot).toContain('b');
        expect(dot).toContain('c');
    });

    test('should escape special characters in labels', () => {
        const ruleJSON = {
            id: 'escape_test',
            comment: 'Test "quotes" and \\backslashes',
            rule: {
                type: 'atom',
                path: 'test.path',
            },
        };

        const rule = parser.parseRule(ruleJSON);
        const dot = visualizer.generateDot(rule);

        expect(dot).toContain('\\"');
        expect(dot).toContain('\\\\');
    });

    test('should handle atom with date flag', () => {
        const ruleJSON = {
            id: 'date_test',
            rule: {
                type: 'atom',
                path: 'birthdate',
                isDate: true,
            },
        };

        const rule = parser.parseRule(ruleJSON);
        const dot = visualizer.generateDot(rule);

        expect(dot).toContain('birthdate');
        expect(dot).toContain('(date)');
    });
});
