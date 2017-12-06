const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    cacheability: './src/index.ts',
    'cacheability.min': './src/index.ts',
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'Cacheability',
    path: resolve(__dirname, 'lib', 'browser'),
    umdNamedDefine: true,
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [{
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          compilerOptions: {
            declaration: false,
            target: 'es5',
          },
        },
      }],
    }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      sourceMap: true,
    }),
    new LodashModuleReplacementPlugin(),
  ],
  devtool: 'source-map',
};
