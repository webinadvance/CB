export default {
  testMatch: ['<rootDir>/test/integration/**/*.test.js'], // Only integration tests
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^\\$lib(.*)$': '<rootDir>/src/lib$1',
  },
  testEnvironment: 'node',
}
