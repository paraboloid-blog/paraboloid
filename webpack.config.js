const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

var nodeModules = {};

fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './server',
  resolve: {
    extensions: [".ts"]
  },
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js'
  },
  plugins: [ new webpack.optimize.UglifyJsPlugin() ],
  externals: nodeModules,
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader'
    }]
  }
}
