// noinspection JSValidateJSDoc
/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ["<rootDir>/test"],
  "collectCoverageFrom": [
    "src/**/{!(Erros)}.ts"
  ]
  // setupFiles: [
  //     "./test/setup.ts"
  // ]
};
