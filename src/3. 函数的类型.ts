/**
 *  type 会给一个类型起个新名字。
 *  type 有时和 interface 很像，但是可以作用于原始值（基本类型），
 *  联合类型，元组以及其它任何你需要手写的类型。
 *  别名可以是任意的合法字符串，一般首字母大写
 * type 和 interface的区别
 *  1. type类型别名，可以定义基础类型，元组等
 *  2. type不可以继承
 *  3. type不会创建一个真正的新的类名
 *  4. 类型别名无法被实现implements，而接口可以被派生类实现
 *  5. 类型别名重名会抛出错误，接口重名是会产生合并
 */

// 1> 通过 function 关键字来进行声明
function sum(a: string, b: string) {
  return a + b;
}

sum('123', '23');

// 2> 通过类型别名来进行声明
type Sum = (a: string, b: string) => string;
let sum2: Sum = (a, b) => a + b;

// 可选参数必须在其他参数的最后面
let sum3 = (a: string, b?: string): string => {
  return a + b || '';
};

// 默认参数
let sum4 = (a: string, b: string = 'b'): string => {
  return a + b;
};
sum4('a');

// 剩余参数
const sum5 = (...rest: string[]): string => {
  return rest.reduce((memo, current) => (memo += current), '');
};
sum5('a', 'b', 'c', 'd');

// typeof 获取对应的类型
// keyof 获取类型对应的所有 key 类型
type IThis = typeof obj;
function getName(this: IThis, key: keyof IThis) {
  return this[key];
}
const obj = { name: 'jw' };
getName.call(obj, 'name');

// 重载，指我们可以定义一些名称相同的方法，通过定义不同的输入参数来区分这些方法
function toArray(value: number): number[];
function toArray(value: string): string[];
function toArray(value: number | string) {
  if (typeof value == 'string') {
    return value.split('');
  } else {
    return value
      .toString()
      .split('')
      .map((item) => Number(item));
  }
}
toArray(123); // 根据传入不同类型的数据 返回不同的结果
toArray('123');

export {};
