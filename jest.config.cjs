const config = require('@repodog/jest-config');

module.exports = {
  ...config,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
};
