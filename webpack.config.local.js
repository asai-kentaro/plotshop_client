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
        //loaders: ['babel-loader?presets[]=react&presets[]=es2015&cacheDirectory'],
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
        NODE_ENV: "'local'"
      }
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.json', '.jsx'],
  },
  externals: {
    '_': "'lodash'",
  }
};

module.exports = config;
