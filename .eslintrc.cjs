module.exports = {
  extends: ['@repodog/eslint-config'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  root: true,
  rules: {
    '@typescript-eslint/no-use-before-define': 0,
    // disabled devDependencies due to https://github.com/import-js/eslint-plugin-import/issues/2168
    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: true,
        peerDependencies: false,
      },
    ],
    'unicorn/prevent-abbreviations': [
      2,
      {
        ignore: [/.*args.*/i, /.*dev.*/i, /.*params.*/i, /.*props.*/i],
      },
    ],
  },
};
