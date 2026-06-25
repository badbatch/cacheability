import config from '@repodog/eslint-config';
import jestConfig from '@repodog/eslint-config-jest';

// Required fro ESLint
// eslint-disable-next-line import-x/no-default-export
export default [
  ...config,
  ...jestConfig.map(entry => ({
    ...entry,
    files: ['**/*.{spec,test}.*'],
  })),
];
