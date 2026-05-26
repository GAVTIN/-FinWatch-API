module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    setupFilesAfterFramework: ['./tests/setup/testSetup.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',     // entry point — not unit testable
        '!src/config/**',     // config files — not business logic
    ],
    coverageThresholds: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    testTimeout: 30000,     // 30s — mongodb-memory-server needs time to start
};