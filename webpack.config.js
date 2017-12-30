const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.ts',
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
        resolve(__dirname, 'test'),
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
    }, {
      enforce: 'post',
      exclude: ['**/*.d.ts'],
      include: resolve(__dirname, 'src'),
      test: /\.tsx?$/,
      use: [{
        loader: 'istanbul-instrumenter-loader',
        options: { esModules: true },
      }],
    }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
      test: /\.tsx?$/,
    }),
    new LodashModuleReplacementPlugin(),
  ],
};
