const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.EnvironmentPlugin({
      WEB_ENV: true,
    }),
    new LodashModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
};
