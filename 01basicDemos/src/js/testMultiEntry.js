// 多入口文件(Multiple entry files)
import ContactsData from './../../public/contacts.json'; //获取json数据
console.log('just for test Multiple entry files');
//打印出json格式中数据
console.log(ContactsData.datas);

// 测试开发环境
if (__DEV__) {
  console.log('这是在开发环境下');
}
