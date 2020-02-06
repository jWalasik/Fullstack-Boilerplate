const path = require('path')
const merge = require('webpack-merge');
const webpack = require('webpack');
const basicConfig = require('./base');

module.exports = merge(basicConfig, {
  mode: 'development',
  entry: [
    'react-hot-loader/patch', // activate HMR for React
    'webpack-dev-server/client?http://localhost:8080',// bundle the client for webpack-dev-server and connect to the provided endpoint
    'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
    './index.tsx', // the entry point of our app
    './styles/styles.scss'
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../client/public/')
  },
  devServer: {
    hot: true, // enable HMR on the server
    open: true,
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
  ],
});
