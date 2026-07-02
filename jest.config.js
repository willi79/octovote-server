/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['<rootDir>/test/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
};
