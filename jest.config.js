export default {
  testEnvironment: 'node',
  testTimeout: 10000,
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: ['**/tests/**/*.js'],
  collectCoverageFrom: [
    'src/**/*.{js,mjs}',
    '!src/**/*.test.{js,mjs}'
  ]
};