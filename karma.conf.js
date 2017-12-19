const { resolve } = require('path');
const webpackConfig = require('./webpack.config');

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'test/**/*',
    ],
    preprocessors: {
      'test/**/*': ['webpack', 'sourcemap'],
    },
    webpack: { ...webpackConfig, devtool: 'cheap-module-eval-source-map' },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    concurrency: Infinity,
    client: {
      captureConsole: true,
      mocha: { timeout: 0 },
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    coverageIstanbulReporter: {
      reports: ['lcov', 'text-summary'],
      dir: resolve(__dirname, 'coverage/web'),
      thresholds: {
        global: {
          statements: 80,
          lines: 80,
          branches: 70,
          functions: 80,
        },
      },
    },
  });
};
