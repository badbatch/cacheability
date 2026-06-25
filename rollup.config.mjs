import rollupConfig from '@repodog/rollup-config';
import swcConfig from '@repodog/swc-config';
import swcPlugin from '@rollup/plugin-swc';

// Required for Rollup
// eslint-disable-next-line import-x/no-default-export
export default {
  ...rollupConfig({ compiler: swcPlugin({ swc: swcConfig.ts }) }),
};
