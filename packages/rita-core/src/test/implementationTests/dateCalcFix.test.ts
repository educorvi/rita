import dateCalc from '../assets/dateCalc.json';
import { Parser } from '../../index';

const p = new Parser();
const data = { randomVal: '2022-10-24T23:59:56.000Z' };
it('step 1', async () => {
    const calc = p.parseDateCalculation({
        type: 'dateCalculation',
        operation: 'subtract',
        dateResultUnit: 'seconds',
        arguments: [
            '2022-10-25T02:00:00.000+02:00',
            {
                type: 'atom',
                path: 'randomVal',
                isDate: true,
            },
        ],
    });
    expect(await calc.evaluate(data)).toBe(4);
});

it('step 2', async () => {
    const calc = p.parseCalculation({
        type: 'calculation',
        operation: 'modulo',
        arguments: [
            {
                type: 'dateCalculation',
                operation: 'subtract',
                dateResultUnit: 'seconds',
                arguments: [
                    '2022-10-25T02:00:00.000+02:00',
                    {
                        type: 'atom',
                        path: 'randomVal',
                        isDate: true,
                    },
                ],
            },
            {
                type: 'calculation',
                operation: 'divide',
                arguments: [10, 1],
            },
        ],
    });
    expect(await calc.evaluate(data)).toBe(4);
});

it('step 3', async () => {
    const calc = p.parseDateCalculation({
        type: 'dateCalculation',
        operation: 'add',
        dateCalculationUnit: 'days',
        arguments: [
            '2022-10-25T02:00:00.000+02:00',
            {
                type: 'calculation',
                operation: 'modulo',
                arguments: [
                    {
                        type: 'dateCalculation',
                        operation: 'subtract',
                        dateResultUnit: 'seconds',
                        arguments: [
                            '2022-10-25T02:00:00.000+02:00',
                            {
                                type: 'atom',
                                path: 'randomVal',
                                isDate: true,
                            },
                        ],
                    },
                    {
                        type: 'calculation',
                        operation: 'divide',
                        arguments: [10, 1],
                    },
                ],
            },
        ],
    });

    expect(<Date>await calc.evaluate(data)).toStrictEqual(
        new Date('2022-10-29T02:00:00.000+02:00')
    );
});

it('step 4', async () => {
    const comp = p.parseComparison({
        type: 'comparison',
        operation: 'equal',
        dates: true,
        arguments: [
            '2022-10-29T02:00:00.000+02:00',
            {
                type: 'dateCalculation',
                operation: 'add',
                dateCalculationUnit: 'days',
                arguments: [
                    '2022-10-25T02:00:00.000+02:00',
                    {
                        type: 'calculation',
                        operation: 'modulo',
                        arguments: [
                            {
                                type: 'dateCalculation',
                                operation: 'subtract',
                                dateResultUnit: 'seconds',
                                arguments: [
                                    '2022-10-25T02:00:00.000+02:00',
                                    {
                                        type: 'atom',
                                        path: 'randomVal',
                                        isDate: true,
                                    },
                                ],
                            },
                            {
                                type: 'calculation',
                                operation: 'divide',
                                arguments: [10, 1],
                            },
                        ],
                    },
                ],
            },
        ],
    });

    expect(await comp.evaluate(data)).toBe(true);
});

it('complete', async () => {
    const ruleset = p.parseRuleSet(dateCalc);
    const result = await ruleset[0].evaluate(data);
    expect(result).toBe(true);
});
