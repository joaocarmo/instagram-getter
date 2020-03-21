const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackRootPlugin = require('html-webpack-root-plugin')
const babelConfig = require('./babel.config')
const packageConfig = require('./package')

const { env: { NODE_ENV } } = process
const mode = NODE_ENV || 'development'
const { publicName } = packageConfig

module.exports = {
  mode,
  context: path.join(__dirname, 'lib'),
  entry: [
    'core-js/stable',
    './index',
  ],
  output: {
    path: path.join(__dirname),
    filename: `${publicName}.user.js`,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelConfig,
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.ProgressPlugin(),
    new Dotenv({
      path: path.join(__dirname, `.env.${mode}`),
    }),
    new HtmlWebpackPlugin({
      title: publicName,
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
    }),
    new HtmlWebpackRootPlugin('app'),
  ],
  devServer: {
    hot: true,
    open: true,
    overlay: true,
    noInfo: true,
    port: 3000,
  },
}
