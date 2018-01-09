const { resolve } = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpackConfig = require('./webpack.config.base');

webpackConfig.plugins.push(
  new webpack.SourceMapDevToolPlugin({
    filename: '[name].js.map',
    test: /\.(tsx?|jsx?)$/,
  }),
  new UglifyJsPlugin({
    sourceMap: true,
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'disabled',
    generateStatsFile: true,
    statsFilename: './bundle/stats.json',
  }),
);

module.exports = {
  entry: {
    cacheability: './src/index.ts',
  },
  output: {
    filename: '[name].js',
    library: 'Cacheability',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      include: [
        resolve(__dirname, 'src'),
      ],
      test: /\.tsx?$/,
      use: [{
        loader: 'awesome-typescript-loader',
        options: {
          babelCore: '@babel/core',
          transpileOnly: true,
          useBabel: true,
        },
      }],
    }],
  },
  ...webpackConfig,
};
