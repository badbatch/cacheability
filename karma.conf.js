const { resolve } = require('path');
const webpack = require('webpack');

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/**/*',
    ],
    preprocessors: {
      'test/**/*': ['webpack', 'sourcemap'],
    },
    webpack: {
      devtool: 'cheap-module-eval-source-map',
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
      module: {
        rules: [{
          test: /\.tsx?$/,
          use: [{
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                target: 'es5',
              },
            },
          }],
        }],
      },
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    concurrency: Infinity,
    client: { captureConsole: true },
    mime: {
      'text/x-typescript': ['ts','tsx'],
    },
  });
};
