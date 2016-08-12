
## 一、环境配置
### step0: 必须有node环境
本机必须先安装`node`环境，可命令行键入：`node -v` //查看是否安装&node版本信息

### step1:创建react项目并初始化npm管理包(package.json)
* mkdir 01basicDemos 创建项目目录
* npm init --yes 初始化npm管理包, `--yes`是默认确认
### step2: 添加依赖和插件
```javascript
//1、本地webpack构建和webpack构建服务端
npm install --save webpack webpack-dev-server
//2、react核心库
npm install --save react react-dom
//3、babel转译用es6编写的React
npm install --save-dev babel-core babel-loader babel-preset-react babel-preset-es2015
//4、转译css样式
npm install --save-dev style-loader css-loader
//5、转译sass(SASS-loader)
npm install --save-dev sass-loader node-sass
//6、单独打包 CSS
npm install --save-dev extract-text-webpack-plugin
//7、转译image图片
npm install --save-dev url-loader
//8、转译Json格式数据
npm install --save-dev json-loader
//9、指定网页的模板，并将转译后输出的`xxx.js`插入`inject`到`index.html`中的插件
npm install html-webpack-plugin --save-dev
```
### step3、npm script构建脚本
```javascript
"scripts": {
  "dev": "webpack-dev-server --progress --config webpack.config.dev.js",
  "prod": "webpack -p --progress --config webpack.config.prod.js"
}
```
**使用命令**
```javascript
npm run dev   //构建开发环境包
npm run prod  //构建生产环境包
```

## 二、webpack教程介绍

包括`dev`开发环境构建的`webpack.config.dev.js`和`prod`生产环境构建的`webpack.config.prod.js`

### section1、转译ES6编写的React(Babel-loader)
* 1、webpack.config.js中转译配置,
> `test: /\.js[x]?$/`匹配正则, x可省, 即配置jsx/js为后缀的文件

```javascript
loaders: [
  {test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader'}
]
```
* 2、转译`React`和`ES6`语法，项目目录下新建babel转译配置文件`.babelrc`
```javascript
{
  "presets": ["react", "es2015"]
}
```
或者不需要`.babelrc`，只需要在webpack.config.js中转译配置如下：
> query:  The query setting can be used to pass Additional options to the loader.

```javascript
loaders: [
  {test: /\.js[x]?$/,exclude: /node_modules/,loader: 'babel',
    query: {presets: ['es2015', 'react']}
  }
]
```

### section2、多入口文件(Multiple entry files)
webpack.config.js中多入口配置
```javascript
module.exports = {
  entry: {
    bundle1: './index.jsx',
    bundle2: './testMultiEntry.js'
  },
  output: {
    filename: '[name].js'
  }
};
```

### section3、转译CSS样式文件(CSS-loader)
* CSS-loader读取Css文件
* Style-loader将样式标签插入Html网页中
> 用`!`来链式调用多个loader, 执行顺序由右到左, 即先执行css-loader再到style-loader

index.jsx
```javascript
import IndexCss from './styles/index.css';
```
index.css
```css
body {
  background-color: rgb(200, 56, 97);
}
```
webpack.config.js
```javascript
loader: [ { test: /\.css$/, loader: 'style-loader!css-loader' } ]
```

### section4、转译sass(SASS-loader)
index.jsx
```javascript
import BgCss from './styles/bg.scss';
```
bg.scss
```css
$bg-color: #ddd;

body {
  background: {
    color: $bg-color
  };
}
```
webpack.config.js
```javascript
{ test: /\.scss$/, loaders: 'style-loader!css-loader!sass-loader' }
```

### section5、Css模块化(CSS Module)
`css-loader?modules`让CSS模块化
> 即CSS文件默认是本地作用域，当然可以用`:global(...)`来套成全局.

app.css
```css
.h1 {
  color:red;
}
:global(.h2) {
  color: blue;
}
```
App.jsx
```javascript
import StyleCss from './../styles/app.css';

<h1 className={StyleCss.h1}>Hello World</h1>
<h2 className="h2">Hello Webpack</h2>
```
webpack.config.js
```javascript
{ test: /\.css$/, loader: 'style-loader!css-loader?modules' }
```

### section6、单独打包 CSS
把 CSS 从 js 文件当中独立出来.
webpack.config.prod.js
```javascript
var ExtractTextPlugin = require('extract-text-webpack-plugin');
plugins: [ new ExtractTextPlugin("style.css") ]

loaders: [ { test: /\.(css|scss)$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules!sass-loader') },
]
plugins: [ new ExtractTextPlugin("[name].css") ]
```

### section7、转译图片(Image loader)
App.jsx
```javascript
import SmallImgSrc from './../../public/small.png';
import BigImgSrc from './../../public/big.png';
//指定src
<img src={SmallImgSrc} />
<img src={BigImgSrc} />
```
webpack.config.js
```javascript
{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
```
>用`?`来传入设置限制`limit`字节，当图片小于8192字节时，图片会转成Data URL；大于8192字节将会转成正常的URL格式.

服务器加载后，可以看到`small.png` 和 `big.png`被转成如下：
```html
<img src="data:image/png;base64,iVBOR...uQmCC">
<img src="4853ca667a2b8b8844eb2693ac1b2578.png">
```

### section8、转译json格式数据(Json loader)
testMultiEntry.js
```javascript
import ContactsData from './../../public/contacts.json'; //获取json数据
//打印出json格式中数据
console.log(ContactsData.datas);
```
webpack.config.js
```javascript
{ test: /\.json$/, loader: 'json-loader' }
```

### section9、网页模板插件html-webpack-plugin
指定网页的模板，并将转译后输出的`xxx.js`插入`inject`到模板网页中的插件.
> 不设置fileName默认输出和template同名，不设置inject默认插入body.

webpack.config.js
```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin')
var htmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});

plugins: [htmlWebpackPluginConfig]
```

### section10、压缩js插件(UglifyJs Plugin)
webpack.config.prod.js
```javascript
var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

plugins: [
  new uglifyJsPlugin({ compress: { warnings: false }
  }),
  new webpack.optimize.OccurrenceOrderPlugin()
]
```
* webpack.optimize.UglifyJsPlugin - Minify 压缩代码，并显示警告信息
* 也可以加入 OccurrenceOrderPlugin。
> 通过发生的次数 module 和 chunk 的 id。一些常用的 Id 取得较低（短）的 id。这使得 id 可以预测，减小大小.

### section11、抽离公共js部分(Common chunk)
webpack.config.js
```javascript
// 抽离公共js部分
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

plugins: [ commonsPlugin ]
```

### section12、热加载两种方式(Hot Module Replacement)
(1) 设置devServer
```javascript
devServer: {
    contentBase: "./dist",
    inline: true,
    port: 8888,   
    colors: true,
    historyApiFallback: true
}
```
* contentBase: 默认以根目录挂到服务端
* port: 默认端口8080
* inline: 为ture，修改代码后会自动刷新浏览器显示最新代码
* historyApiFallback: 使用html5的history的API，不匹配的路由都会打开/

(2) 添加HotModuleReplacementPlugin插件

- 添加 `new webpack.HotModuleReplacementPlugin()` 到 `plugins` 插件区域
- 添加 `webpack/hot/dev-server` 和 `webpack-dev-server/client?http://localhost:8080` 到 `entry` 入口区域

webpack.config.dev.js
```javascript
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    './index.js'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
```

### section13、省略文件后缀名
如：可以 import './myJSFile' 而不需要指定文件后缀 import './myJSFile.jsx'
```javascript
resolve: {
 extensions: ['.js', '.jsx']
}
```
只是赶脚有后缀可以直接看清楚是什么类型文件，所以demos中webpack.config.js并不添加使用resolve.

### section14、环境标识符(Environment flags)
testMultiEntry.js
```javascript
// 测试开发环境
if (__DEV__) {
  console.log('这是在开发环境下');
}
```
webpack.config.dev.js
```javascript
var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});
plugins: [devFlagPlugin]
```
package.json
```javascript
env DEBUG=true webpack-dev-server
```
