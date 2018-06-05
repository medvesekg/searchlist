const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/demo.js',
  mode: 'development',
  devtool: 'inline-cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'demo.js'
  },
  module: {
      rules: [
          {
              test: /\.vue$/,
              loader: 'vue-loader'
          },
          {
            test: /\.css$/,
            use: [
              'vue-style-loader',
              'css-loader'
            ]
          }
      ]
  },
  plugins: [
      new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  //externals: [nodeExternals()]
};