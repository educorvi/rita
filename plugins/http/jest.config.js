/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>/test'],
    testEnvironment: 'node',
    globalSetup: '<rootDir>/test/setupTestServer.js',
    globalTeardown: '<rootDir>/test/teardownServer.js',
};
