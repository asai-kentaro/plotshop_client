var webpack = require('webpack');
var path = require('path');

var env = process.env.NODE_ENV;
var config = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx$/,
        loader: 'jsx-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  entry: {
    main: path.join(__dirname, 'src/js/main.js')
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: "'server'"
      }
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.json', '.jsx'],
  },
  externals: {
    '_': 'lodash',
  }
};

module.exports = config;
