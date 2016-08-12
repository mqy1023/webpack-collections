import React from 'react';
import StyleCss from './../styles/app.css';
import SmallImgSrc from './../../public/small.png';
import BigImgSrc from './../../public/big.png';

const App = ({ children = 'Hello World!'}) => {
  return (
    <div>
      <h1 className={StyleCss.h1}>Hello World</h1>
      <h2 className="h2">Hello Webpack</h2>
      <p>{children}</p>
      <img src={SmallImgSrc} />
      <img src={BigImgSrc} />
    </div>);
}

//无状态函数式组件的写法也是支持设置默认的Props类型与值的：
App.propTypes = {
  children: React.PropTypes.string
};

export default App;
