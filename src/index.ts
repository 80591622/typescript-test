// 类型声明
// 有些代码使用cdn引入的，或者有些包使用js来写的没有提示，有些模块导入的格式不是js或者ts
// 添加声明文件 为了统一管理而且不影响核心代码，我们将声明的内容都放入到 .d.ts 文件中
// 我们写好的内容放到 .d.ts 中，ts默认会检测当前项目下所有的 .d.ts 文件
// 我们会将 declare 声明的内容放置到类型声明文件中即.d.ts中，这样不会影响核心代码，并且统一管理。默认项目编译时会查找所有以.d.ts结尾的文件

// console.log(age);
// console.log(sum('1', '2'));

// $('.box').height(100).width(100).extend({ color: 'red' });

import mitt from 'mitt';
import url from 'a.jpg';

// 创建mitt实例
const emitter = mitt();

// 定义监听器
const listener = function (data: string) {
  console.log(data);
};

// 注册事件
emitter.on('data', listener);

// 触发事件
emitter.emit('data', 'this is data');

// 移除事件
emitter.off('data', listener);
