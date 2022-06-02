/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ["<rootDir>/test"],
  "collectCoverageFrom": [
    "src/**/{!(Logger),(Assertions)}.ts"
  ],
  "setupFilesAfterEnv": ["jest-extended/all", "<rootDir>/test/setup.ts"]
};
