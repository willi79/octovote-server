/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    projects: [
        {
            displayName: 'unit',
            preset: 'ts-jest',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/test/unit/**/*.test.ts'],
            clearMocks: true,
        },
        {
            displayName: 'integration',
            preset: 'ts-jest',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/test/integration/**/*.test.ts'],
            setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
            clearMocks: true,
        },
    ],
    verbose: true,
    forceExit: true,
    clearMocks: true,
};
