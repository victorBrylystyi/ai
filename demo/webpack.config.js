'use strict';

const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  context: __dirname,
  devtool: 'eval-source-map',
  entry: ['./index'],
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "out"),
    filename: "bundle.js",
  },
  devServer: {
    overlay: true,
    compress: true,
    port: 9002,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
      },
    ],
  },
  
  plugins: [new HtmlWebpackPlugin({template:'./index.html'})],
};