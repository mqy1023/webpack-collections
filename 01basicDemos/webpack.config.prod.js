//1、网页模板插件
var HtmlWebpackPlugin = require('html-webpack-plugin')
var htmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});
//2、压缩js插件
var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
//3、从js中抽离出css文件
var ExtractTextPlugin = require('extract-text-webpack-plugin');

//4、抽离公共js部分
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
    entry: {
      index: __dirname + '/src/index.jsx',
      multiEntry: __dirname + '/src/js/testMultiEntry.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
    },
    module: {
        loaders: [
          { test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader' },
          { test: /\.(css|scss)$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules!sass-loader') },
          { test: /\.json$/, loader: 'json-loader' },
          { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
        ]
    },
    plugins: [
      htmlWebpackPluginConfig,
      commonsPlugin,
      new uglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new ExtractTextPlugin("[name].css")
    ]
}
