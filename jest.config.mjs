import jestConfig from '@repodog/jest-config';
import swcConfig from '@repodog/swc-config';

// Required for Jest
// eslint-disable-next-line import-x/no-default-export
export default {
  ...jestConfig({ compilerOptions: swcConfig }),
};
