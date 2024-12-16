export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^\\$lib/(.*)$': '<rootDir>/src/lib/$1',
  },
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!(svelte|@sveltejs)/)'],
}
