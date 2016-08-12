//1、网页模板插件
var HtmlWebpackPlugin = require('html-webpack-plugin')
var htmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});

var webpack = require('webpack');
//2、抽离公共js部分
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

// 3、定义环境标识符
var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});


module.exports = {
  devtool: 'eval-source-map',
    entry: {
      index: './src/index.jsx',
      multiEntry: './src/js/testMultiEntry.js'
    },
    output: {
        path:'./dist',
        filename: '[name].js',
    },

    devServer: {
        inline: true,
        port: 8888,
        contentBase: "./dist",
        colors: true,
        historyApiFallback: true,
    },

    module: {
        loaders: [
          { test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader' },
          { test: /\.css$/, loader: 'style-loader!css-loader?modules' },
          { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
          { test: /\.json$/, loader: 'json-loader' },
          { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
        ]
    },
    plugins: [
      htmlWebpackPluginConfig,
      commonsPlugin,
      devFlagPlugin
    ]
}
