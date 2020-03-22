const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackRootPlugin = require('html-webpack-root-plugin')
const babelConfig = require('./babel.config')
const packageConfig = require('./package')

const { env: { NODE_ENV } } = process
const mode = NODE_ENV || 'development'
const { publicName } = packageConfig

const srcDir = path.join(__dirname, 'lib')
const destDir = path.join(__dirname, 'dist')

module.exports = {
  mode,
  context: srcDir,
  entry: {
    bundle: ['core-js/stable', './index'],
  },
  output: {
    filename: `${publicName}.[name].js`,
    path: destDir,
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
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true,
            },
          },
        ],
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
    new CopyPlugin([
      {
        from: path.join(srcDir, 'template.meta.js'),
        to: path.join(destDir, `${publicName}.meta.js`),
      },
    ]),
  ],
  devServer: {
    hot: true,
    open: true,
    overlay: true,
    noInfo: true,
    port: 3000,
  },
}
