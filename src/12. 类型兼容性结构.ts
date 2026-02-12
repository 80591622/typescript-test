// 鸭子类型检测 结构化类型检测
// 子类型可以赋予给父类型，从结构角度出发。ts比较的不是类型的名称，而是这个结构上的属性和方法

// 将一个值赋予给另一个值可以产生兼容性
// 基础类型的兼容性问题

// 定义一个对象类型，它只要求有一个 toString 方法
// 1. 基础类型的兼容性
let obj: {
  toString(): string;
};

// 定义一个字符串变量
let str: string = 'jw';

// 赋值成功：因为字符串 str 拥有 toString 方法，满足 obj 的结构要求
obj = str;

// 从安全的角度出发，你要的属性我都满足。只能访问已经存在的属性，不存在的无法方法
// 2. 接口的兼容性
interface IAnimal {
  name: string;
  age: number;
}
interface IPerson {
  name: string;
  age: number;
  address: string;
}
let animal: IAnimal;
let person: IPerson = {
  name: 'jw',
  age: 30,
  address: '回龙观'
};
animal = person; // 在后台返回的数据中我们可以预先定义好接口数据类型，多的属性也可以赋值给这个类型

// 3. 函数的兼容性
let sum1 = (a: string, b: string) => a + b;
let sum2 = (a: string) => a;
// 参数只能少不能多
sum1 = sum2;

// 针对返回值而言赋予的函数返回值只要是被赋值的子类型即可
type sum2 = () => string | number;
type sum3 = () => string;

let fn1: sum2;
let fn2!: sum3;
fn1 = fn2;

// 要赋予的函数参数只能少不能多
type Func<T> = (item: T, index: number, array: T[]) => void;
function forEach<T>(arr: T[], cb: Func<T>) {
  for (let i = 0; i < arr.length; i++) {
    cb(arr[i], i, arr);
  }
}
forEach([1, 2, 3], (item) => {
  console.log(item);
});

class Parent {
  house() {}
}
class Child extends Parent {
  car() {}
}
class Grandson extends Child {
  money() {}
}

function fn(callback: (instance: Child) => Child) {
  let child = new Child();
  let ins: Child = callback(child);
  return ins;
}

// 为什么赋予的函数 可以写Parent 但是不能写Grandson。内部调用的时候传递的是Child，在拿到这个实例的时候不能访问Child访问不到的属性
fn((instance: Child): Grandson => {
  return new Grandson();
});

// let t1: (instance: Child) => void = (instance: Parent) => ""; // 函数的参数是逆变的
// let t2: (instance: Child) => Child = (instance: Child) => new Grandson(); // 函数的返回值是协变的

// 传递的函数 （传父（参数是逆变的） 返子（返回值是协变的））

// 对于函数的兼容性而言，参数个数要少，传递的可以是父类， 返回值可以返回儿子

// 推导公式:
type Arg<T> = (arg: T) => void;
type Return<T> = (arg: any) => T;

type ArgType = Arg<Parent> extends Arg<Child> ? true : false; // 逆变
type ReturnType = Return<Grandson> extends Return<Child> ? true : false; // 协变

interface MyArray<T> {
  // 方法定义：不会对参数进行逆变检测
  concat(...args: T[]): T[];
  // 函数属性定义：这种方式会检测逆变，不推荐
  // concat: (...args: T[]) => void;
}

// 声明两个变量
let arr1!: MyArray<Parent>;
let arr2!: MyArray<Child>;

// 类型展开：
// arr1 的 concat 方法类型为 (...args: Parent[]): Parent[]
// arr2 的 concat 方法类型为 (...args: Child[]): Child[]

// 赋值成功：arr2 (MyArray<Child>) 可以赋值给 arr1 (MyArray<Parent>)
arr1 = arr2;

// 对于类而言，子类的方法可以重写父类的方法
//strictFunctionTypes 开启后就变成了双向协变，参数和返回值都是协变的

// ts比较的是结构，结构一致即可
interface IT<T> {}
let obj1: IT<string>;
let obj2!: IT<number>;
obj1 = obj2;

// 不同枚举的类型是不兼容的
enum USER1 {
  role = 1
}
enum USER2 {
  role = 1
}
let user1!: USER1;
let user2!: USER2;
// user2 = user1; // 错误语法

// 类的兼容性
class A {
  public name!: string;
}

class B {
  public name!: string;
  public age!: string;
}

// 赋值合法：B 的结构包含了 A 的所有属性，满足结构化类型兼容
let b: A = new B(); // 比较的是属性，不符合就不兼容。如果类中存在私有属性或者受保护的属性，则不能兼容

// ts 比较类型结构的时候比较的是属性和方法
// 如果属性和方法都满足则兼容，有一些比较特殊

// 基础类型和对象类型的兼容，接口的兼容，泛型的兼容，枚举的兼容，类的兼容

// 在其他语言中存在标称类型（根据名称来区分类型）,通过交叉类型实现标称类型
// type BTC = number; // 无法区分两个类型
// type USDT = number;

// let btc: BTC = 1000;
// let usdt: USDT = 1000;
// // 要求传入btc
// function getCount(count: BTC) {
//   return count as BTC;
// }
// let count = getCount(usdt); // 实际传入usdt

type Nominal<T, U extends string> = T & { __tag: U };
type BTC = Nominal<number, 'btc'>;
type USDT = Nominal<number, 'usdt'>; // 标称类型

let btc: BTC = 1000 as BTC;
let usdt: USDT = 1000 as USDT;
function getCount(count: BTC) {
  // 获取BTC的数量
  return count;
}
// let count = getCount(usdt); // 报错：无法传入usdt

export {};
