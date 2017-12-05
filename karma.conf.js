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
        extensions: ['.ts', '.js', '.json']
      },
      module: {
        rules: [{
          test: /\.(ts|js)$/,
          include: [
            resolve(__dirname, 'src'),
            resolve(__dirname, 'test'),
          ],
          use: { loader: 'babel-loader' },
        }],
      },
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    concurrency: Infinity,
    client: { captureConsole: true }
  });
};
