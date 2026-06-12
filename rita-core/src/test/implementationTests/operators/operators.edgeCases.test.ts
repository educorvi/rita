import { And, Not, Or } from '../../../logicElements/Operators';
import { Comparison, comparisons } from '../../../logicElements/Comparison';
import { Parser } from '../../../index';
import { ruleTemplate } from '../../assets/exampleData';

const p = new Parser();

// Helper: a comparison that always resolves to true
function alwaysTrue() {
    return new Comparison([1, 1], comparisons.equal);
}

// Helper: a comparison that always resolves to false
function alwaysFalse() {
    return new Comparison([1, 2], comparisons.equal);
}

describe('And - validate', () => {
    it('returns false with exactly 1 argument', () => {
        const and = new And([alwaysTrue()]);
        expect(and.validate()).toBe(false);
    });

    it('returns false with 0 arguments', () => {
        const and = new And([]);
        // reduce on empty array throws, but validate checks length first
        expect(and.validate()).toBe(false);
    });

    it('returns true with 2 valid arguments', () => {
        const and = new And([alwaysTrue(), alwaysTrue()]);
        expect(and.validate()).toBe(true);
    });
});

describe('And - short-circuit: all false means false', () => {
    it('false && false === false', async () => {
        const and = new And([alwaysFalse(), alwaysFalse()]);
        expect(await and.evaluate({})).toBe(false);
    });

    it('true && false === false', async () => {
        const and = new And([alwaysTrue(), alwaysFalse()]);
        expect(await and.evaluate({})).toBe(false);
    });
});

describe('And - toJsonReady', () => {
    it('includes type: and', () => {
        const and = new And([alwaysTrue(), alwaysTrue()]);
        const json = and.toJsonReady();
        expect(json.type).toBe('and');
        expect(Array.isArray(json.arguments)).toBe(true);
    });
});

describe('Or - validate', () => {
    it('returns false with exactly 1 argument', () => {
        const or = new Or([alwaysTrue()]);
        expect(or.validate()).toBe(false);
    });

    it('returns false with 0 arguments', () => {
        const or = new Or([]);
        expect(or.validate()).toBe(false);
    });

    it('returns true with 2 valid arguments', () => {
        const or = new Or([alwaysTrue(), alwaysFalse()]);
        expect(or.validate()).toBe(true);
    });
});

describe('Or - default start value is false', () => {
    it('false || false === false', async () => {
        const or = new Or([alwaysFalse(), alwaysFalse()]);
        expect(await or.evaluate({})).toBe(false);
    });

    it('false || true === true', async () => {
        const or = new Or([alwaysFalse(), alwaysTrue()]);
        expect(await or.evaluate({})).toBe(true);
    });
});

describe('Or - toJsonReady', () => {
    it('includes type: or', () => {
        const or = new Or([alwaysTrue(), alwaysFalse()]);
        const json = or.toJsonReady();
        expect(json.type).toBe('or');
    });
});

describe('Not - validate', () => {
    it('returns false with 0 arguments', () => {
        const not = new Not([]);
        expect(not.validate()).toBe(false);
    });

    it('returns false with 2 arguments', () => {
        const not = new Not([alwaysTrue(), alwaysTrue()]);
        expect(not.validate()).toBe(false);
    });

    it('returns true with exactly 1 argument', () => {
        const not = new Not([alwaysTrue()]);
        expect(not.validate()).toBe(true);
    });
});

describe('Not - evaluate', () => {
    it('negates a truthy formula', async () => {
        const not = new Not([alwaysTrue()]);
        expect(await not.evaluate({})).toBe(false);
    });

    it('negates a falsy formula', async () => {
        const not = new Not([alwaysFalse()]);
        expect(await not.evaluate({})).toBe(true);
    });
});

describe('Not - toJsonReady', () => {
    it('includes type: not', () => {
        const not = new Not([alwaysTrue()]);
        const json = not.toJsonReady();
        expect(json.type).toBe('not');
    });
});

describe('Operators - nested combinations', () => {
    it('not(and(true, true)) === false', async () => {
        const rule = p.parseRule({
            ...ruleTemplate,
            rule: {
                type: 'not',
                arguments: [
                    {
                        type: 'and',
                        arguments: [
                            {
                                type: 'comparison',
                                operation: 'equal',
                                arguments: [1, 1],
                            },
                            {
                                type: 'comparison',
                                operation: 'equal',
                                arguments: [2, 2],
                            },
                        ],
                    },
                ],
            },
        });
        expect(await rule.evaluate({})).toBe(false);
    });

    it('or(not(true), true) === true', async () => {
        const rule = p.parseRule({
            ...ruleTemplate,
            rule: {
                type: 'or',
                arguments: [
                    {
                        type: 'not',
                        arguments: [
                            {
                                type: 'comparison',
                                operation: 'equal',
                                arguments: [1, 1],
                            },
                        ],
                    },
                    {
                        type: 'comparison',
                        operation: 'equal',
                        arguments: [3, 3],
                    },
                ],
            },
        });
        expect(await rule.evaluate({})).toBe(true);
    });
});
