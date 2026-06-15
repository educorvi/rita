const fs = require('node:fs');
const path = require('node:path');

const Ajv = require('ajv/dist/2019').default;
const addFormats = require('ajv-formats').default;
const standaloneCode = require('ajv/dist/standalone').default;

const packageRoot = path.resolve(__dirname, '..');
const schemaDir = path.join(packageRoot, 'src', 'schema');
const outputPath = path.join(
  packageRoot,
  'src',
  'Validator',
  'RitaRulesetAjvValidator.js'
);

const loadSchema = (name) => require(path.join(schemaDir, name));

const rootSchema = loadSchema('schema.json');
const referencedSchemas = [
  'atom.json',
  'calculation.json',
  'comparison.json',
  'dateCalculation.json',
  'formula.json',
  'macro.json',
  'operator.json',
  'plugin.json',
  'quantifier.json',
  'rule.json',
].map(loadSchema);

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  code: {
    source: true,
  },
});

addFormats(ajv);
for (const schema of referencedSchemas) {
  ajv.addSchema(schema);
}

const validate = ajv.compile(rootSchema);
const generated = standaloneCode(ajv, validate);

fs.writeFileSync(outputPath, generated);
