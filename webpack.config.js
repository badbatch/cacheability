const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    filename: '[name].js',
    library: 'Cacheability',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          babelrc: false,
          plugins: ['lodash'],
          presets: [
            ['@babel/preset-env', {
              debug: true,
              targets: { browsers: 'last 4 versions' },
              useBuiltIns: 'usage',
            }],
            '@babel/preset-stage-0',
          ],
        },
      }, {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
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
    new LodashModuleReplacementPlugin(),
  ],
  devtool: 'source-map',
};
