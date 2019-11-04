const repodogConfig = require('@repodog/jest-config');

module.exports = {
  ...repodogConfig,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!**/types.ts', '!**/*.test.*', '!**/__test__/**'],
  testMatch: ['<rootDir>/src/**/*.test.*'],
};
