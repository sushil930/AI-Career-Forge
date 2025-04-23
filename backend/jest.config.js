/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'], // Look for test files in any 'tests' subdirectory ending with .test.ts
  verbose: true, // Show detailed output for each test
  forceExit: true, // Helps prevent hanging tests, especially with async operations
  clearMocks: true, // Automatically clear mock calls and instances between every test
  testTimeout: 30000, // Increase test timeout to 30 seconds
  // Optional: Setup file to run before tests (e.g., for environment variables)
  // setupFiles: ['<rootDir>/src/tests/setup.ts'], 
}; 