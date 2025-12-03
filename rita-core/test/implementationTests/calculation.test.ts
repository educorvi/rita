import { evaluateAll, Parser } from '../../src';
import { exampleData } from '../assets/exampleData';
import { DateTime } from 'luxon';
import modulo from '../assets/modulo.json';

const p = new Parser();

describe('Numbers', () => {
    it('add', () => {
        const calc = p.parseCalculation({
            type: 'calculation',
            operation: 'add',
            arguments: [2, 6],
        });

        expect(calc.evaluate({})).resolves.toBe(8);
    });
    it('subtract', () => {
        const calc = p.parseCalculation({
            type: 'calculation',
            operation: 'subtract',
            arguments: [2, 6],
        });

        expect(calc.evaluate({})).resolves.toBe(-4);
    });
    it('subtract with three arguments', () => {
        const calc = p.parseCalculation({
            type: 'calculation',
            operation: 'subtract',
            arguments: [6, 2, 2],
        });

        expect(calc.evaluate({})).resolves.toBe(2);
    });
    it('multiply', () => {
        const calc = p.parseCalculation({
            type: 'calculation',
            operation: 'multiply',
            arguments: [2, 6],
        });

        expect(calc.evaluate({})).resolves.toBe(12);
    });
    it('divide', () => {
        const calc = p.parseCalculation({
            type: 'calculation',
            operation: 'divide',
            arguments: [6, 2],
        });

        expect(calc.evaluate({})).resolves.toBe(3);
    });
    it('modulo', () => {
        const calc = p.parseCalculation({
            type: 'calculation',
            operation: 'modulo',
            arguments: [7, 2],
        });

        expect(calc.evaluate({})).resolves.toBe(1);
    });

    it('modulo example', async function () {
        const m = p.parseRuleSet(modulo);
        const ret = await evaluateAll(m, { numberFromData: 2.2 });
        expect(ret.result).toBe(true);
    });

    it('atom sub', () => {
        const calc = p.parseCalculation({
            type: 'calculation',
            operation: 'subtract',
            arguments: [
                {
                    type: 'atom',
                    path: 'visit.priceWithoutTax',
                },
                2,
            ],
        });

        expect(calc.evaluate(exampleData)).resolves.toBe(8.99);
    });
});

function formatDate(d: Date): string {
    return DateTime.fromJSDate(d).toFormat('yyyy-MM-dd');
}

describe('Dates', () => {
    it('days from 20.12.2020 to 24.12.2020', () => {
        const calc = p.parseFormula({
            type: 'dateCalculation',
            operation: 'subtract',
            dateResultUnit: 'days',
            arguments: ['2020-12-24', '2020-12-20'],
        });
        expect(calc.evaluate(exampleData)).resolves.toBe(4);
    });
    it('how many full years from date of birth to 12.11.2021', async () => {
        const calc = p.parseFormula({
            type: 'dateCalculation',
            operation: 'subtract',
            dateResultUnit: 'years',
            arguments: [
                '2021-11-12',
                {
                    type: 'atom',
                    path: 'dateOfBirth',
                    isDate: true,
                },
            ],
        });
        expect(Math.floor(<number>await calc.evaluate(exampleData))).toBe(21);
    });
    it('two days ago from 12.11.2021', async () => {
        const calc = p.parseFormula({
            type: 'dateCalculation',
            operation: 'subtract',
            dateCalculationUnit: 'days',
            arguments: ['2021-11-12', 2],
        });
        expect(formatDate(<Date>await calc.evaluate(exampleData))).toEqual(
            formatDate(new Date('2021-11-10'))
        );
    });
    it('two days ago from 12.11.2021 in different order', async () => {
        const calc = p.parseFormula({
            type: 'dateCalculation',
            operation: 'subtract',
            dateCalculationUnit: 'days',
            arguments: [2, '2021-11-12'],
        });
        expect(formatDate(<Date>await calc.evaluate(exampleData))).toEqual(
            formatDate(new Date('2021-11-10'))
        );
    });
    it('2+2 days from 12.11.2021', async () => {
        const calc = p.parseFormula({
            type: 'dateCalculation',
            operation: 'add',
            dateCalculationUnit: 'days',
            arguments: [2, 2, '2021-11-12'],
        });
        expect(formatDate(<Date>await calc.evaluate(exampleData))).toEqual(
            formatDate(new Date('2021-11-16'))
        );
    });
    it('two years in the future from 12.11.2021', async () => {
        const calc = p.parseFormula({
            type: 'dateCalculation',
            operation: 'add',
            dateCalculationUnit: 'years',
            arguments: ['2021-11-12', 2],
        });
        expect(formatDate(<Date>await calc.evaluate(exampleData))).toEqual(
            formatDate(new Date('2023-11-12'))
        );
    });
    it('time difference less then 2 minutes', () => {
        const calc = p.parseFormula({
            type: 'dateCalculation',
            operation: 'subtract',
            dateResultUnit: 'minutes',
            arguments: ['2021-11-12T09:29', '2021-11-12T09:27:30'],
        });
        expect(calc.evaluate({})).resolves.toBeLessThan(2);
    });
});
