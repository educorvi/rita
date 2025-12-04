import { getAtoms, Parser, Plugin } from '../../src';
import example1 from '../assets/example1.json';
import exampleMath from '../assets/exampleMath.json';
import dateCalc from '../assets/dateCalc.json';
import defaultVal from '../assets/defaultVal.json';
import mathSimple from '../assets/mathSimple.json';
import modulo from '../assets/modulo.json';
import plugin from '../assets/plugin.json';
import quantifiers_ex from '../assets/quantifiers_ex.json';
import quantifiers_fa from '../assets/quantifiers_fa.json';
import quantifiers_index from '../assets/quantifiers_indexTests.json';
import quantifiers_index2 from '../assets/quantifiers_indexTests2.json';
import macros from '../assets/macros';
import { expect } from 'vitest';

class DummyPlugin extends Plugin {
    enrichData(data: Record<string, any>): Promise<Record<string, any>> {
        return Promise.resolve(data);
    }
    getName(): string {
        return 'fancy-plugin';
    }
    getVersion(): string {
        return '1.0.0';
    }
}

const p = new Parser([DummyPlugin]);
// p.registerPlugin('fancy-plugin', DummyPlugin);

describe('getAtoms', () => {
    it('should extract atoms from example1', () => {
        const ruleset = p.parseRuleSet(example1);
        const result = getAtoms(ruleset);

        expect(result.pathSet).toContain('member');
        expect(result.pathSet).toContain('employee');
        expect(result.pathSet.length).toBe(2);
        expect(result.atoms).toHaveLength(3); // member, employee, employee
        expect(result.atoms[0].path).toBe('member');
        expect(result.atoms[1].path).toBe('employee');
        expect(result.atoms[2].path).toBe('employee');
    });

    it('should extract atoms from exampleMath', () => {
        const ruleset = p.parseRuleSet(exampleMath);
        const result = getAtoms(ruleset);

        expect(result.pathSet).toContain('dateOfBirth');
        expect(result.pathSet).toContain('visit.priceWithoutTax');
        expect(result.pathSet).toContain('visit.tax');
        expect(result.pathSet).toContain('name');
        expect(result.pathSet.length).toBe(4);
        expect(result.atoms).toHaveLength(4);
        expect(result.atoms[0].path).toBe('dateOfBirth');
        expect(result.atoms[1].path).toBe('visit.priceWithoutTax');
        expect(result.atoms[2].path).toBe('visit.tax');
        expect(result.atoms[3].path).toBe('name');
    });

    it('should extract atoms from dateCalc', () => {
        const ruleset = p.parseRuleSet(dateCalc);
        const result = getAtoms(ruleset);
        expect(result.pathSet).toContain('randomVal');
        expect(result.pathSet.length).toBe(1);
        expect(result.atoms).toHaveLength(1);
        expect(result.atoms[0].path).toBe('randomVal');
    });

    it('should extract atoms from defaultVal', () => {
        const ruleset = p.parseRuleSet(defaultVal);
        const result = getAtoms(ruleset);
        expect(result.pathSet).toContain('fancyness');
        expect(result.pathSet.length).toBe(1);
        expect(result.atoms).toHaveLength(1);
        expect(result.atoms[0].path).toBe('fancyness');
    });

    it('should extract atoms from mathSimple', () => {
        const ruleset = p.parseRuleSet(mathSimple);
        const result = getAtoms(ruleset);
        expect(result.pathSet).toContain('visit.priceWithoutTax');
        expect(result.pathSet.length).toBe(1);
        expect(result.atoms).toHaveLength(1);
        expect(result.atoms[0].path).toBe('visit.priceWithoutTax');
    });

    it('should extract atoms from modulo', () => {
        const ruleset = p.parseRuleSet(modulo);
        const result = getAtoms(ruleset);
        expect(result.pathSet).toContain('numberFromData');
        expect(result.pathSet.length).toBe(1);
        expect(result.atoms).toHaveLength(1);
        expect(result.atoms[0].path).toBe('numberFromData');
    });

    it('should extract atoms from plugin', () => {
        const ruleset = p.parseRuleSet(plugin);
        const result = getAtoms(ruleset);
        expect(result.pathSet).toContain('fancy');
        expect(result.pathSet.length).toBe(1);
        expect(result.atoms).toHaveLength(1);
        expect(result.atoms[0].path).toBe('fancy');
    });

    it('should extract atoms from quantifiers_ex', () => {
        const ruleset = p.parseRuleSet(quantifiers_ex);
        const result = getAtoms(ruleset);
        expect(result.pathSet).toContain('arraydata');
        expect(result.pathSet).toContain('arrayItem');
        expect(result.pathSet).toContain('val1');
        expect(result.pathSet).toContain('val2');
        expect(result.pathSet).toContain('val3');
        expect(result.pathSet.length).toBe(5);
        expect(result.atoms).toHaveLength(6);
        expect(result.atoms[0].path).toBe('arraydata');
        expect(result.atoms[1].path).toBe('arrayItem');
        expect(result.atoms[2].path).toBe('val1');
        expect(result.atoms[3].path).toBe('val2');
        expect(result.atoms[4].path).toBe('val3');
        expect(result.atoms[5].path).toBe('arrayItem');
    });

    it('should extract atoms from quantifiers_fa', () => {
        const ruleset = p.parseRuleSet(quantifiers_fa);
        const result = getAtoms(ruleset);
        expect(result.pathSet).toContain('arraydata');
        expect(result.pathSet).toContain('arrayItem');
        expect(result.pathSet).toContain('val1');
        expect(result.pathSet).toContain('val2');
        expect(result.pathSet).toContain('val3');
        expect(result.pathSet.length).toBe(5);
        expect(result.atoms).toHaveLength(6);
        expect(result.atoms[0].path).toBe('arraydata');
        expect(result.atoms[1].path).toBe('arrayItem');
        expect(result.atoms[2].path).toBe('val1');
        expect(result.atoms[3].path).toBe('val2');
        expect(result.atoms[4].path).toBe('val3');
        expect(result.atoms[5].path).toBe('arrayItem');
    });

    it('should extract atoms from quantifiers_indexTests', () => {
        const ruleset = p.parseRuleSet(quantifiers_index);
        const result = getAtoms(ruleset);
        expect(result.pathSet).toContain('arraydata');
        expect(result.pathSet).toContain('arrayItem');
        expect(result.pathSet).toContain('index');
        expect(result.pathSet).toContain('$arrayItem');
        expect(result.pathSet).toContain('$index');
        expect(result.pathSet.length).toBe(5);
        expect(result.atoms).toHaveLength(6);
        expect(result.atoms[0].path).toBe('arraydata');
        expect(result.atoms[1].path).toBe('arrayItem');
        expect(result.atoms[2].path).toBe('index');
        expect(result.atoms[3].path).toBe('arraydata');
        expect(result.atoms[4].path).toBe('$arrayItem');
        expect(result.atoms[5].path).toBe('$index');
    });

    it('should extract atoms from quantifiers_indexTests2', () => {
        const ruleset = p.parseRuleSet(quantifiers_index2);
        const result = getAtoms(ruleset);
        expect(result.pathSet).toContain('arraydata');
        expect(result.pathSet).toContain('arrayItem.boolean');
        expect(result.pathSet).toContain('index');
        expect(result.pathSet.length).toBe(3);
        expect(result.atoms).toHaveLength(3);
        expect(result.atoms[0].path).toBe('arraydata');
        expect(result.atoms[1].path).toBe('arrayItem.boolean');
        expect(result.atoms[2].path).toBe('index');
    });

    it('should extract atoms from macros', () => {
        const ruleset = p.parseRuleSet(macros);
        const result = getAtoms(ruleset);
        expect(result.pathSet).toContain('customers');
        expect(result.pathSet.length).toBe(1);
        expect(result.atoms).toHaveLength(1);
        expect(result.atoms[0].path).toBe('customers');
    });
});
