// 正常判断类型的时候 可以通过 A extends B A 是 B 的子类型
// 条件分发 （分发特性是默认开启的）
// 1. A 类型是通过泛型传入的
// 2. A 类型如果是联合类型会进行分发
// 3. 泛型参数 A 必须是完全裸露的，才具备分发的能力
// 裸类型就是没有包裹任何类型的类型，比如 number, string, boolean, never, 等

interface Fish {
  name: '鱼';
}
interface Water {
  type: '水';
}
interface Bird {
  name: '鸟';
}
interface Sky {
  type: '天空';
}

type Condition1 = Fish | Bird extends Fish ? Water : Sky; // 这种情况不产生分发
type Condition2<T> = T extends Fish ? Water : Sky;
// Condition2 <Fish> => water
// Condition2 <Bird> => sky
type R1 = Condition2<Fish | Bird>; // 会将联合类型的每一项进行比较

// 默认情况下 有些时候我们需要关闭这种分发能力，会造成判断不准确
type Conditional3<T, U> = T extends U ? true : false;
// true | false -> boolean
type R2 = Conditional3<1 | 2, 1>;
// 分发就是挨个比较，不想分发就是将结果运算后再比较

// 禁用分发
// 方式1
type NoDistribute<T> = T & {}; // 只是为了让这个T产生一个类型而已
type Conditional4<T, U> = NoDistribute<T> extends U ? true : false;
type R3 = Conditional4<1 | 2, 1>;
// 方式2
type Conditional5<T, U> = [T] extends [U] ? true : false;
type R4 = Conditional5<1 | 2, 1>;

// never 类型的特殊性：
// 当 T 是 never 时，NoDistribute<T> 也会是 never。
// 在条件类型 never extends never ? true : false 中，
// TypeScript 的行为是直接返回 never，而不是 true 或 false，
// 这导致 IsNever < never > 的结果不符合预期
type IsNever<T> = [T] extends [never] ? true : false;
type R5 = IsNever<never>; // true

// 我们在进行类型父子关系的比较时，默认情况下都应该关闭分发

// 通过条件类型，ts自己实现了一些常见的内置类型
// 我们在使用ts的时候需要安装typescript模块 （包含了很多的内置类型）

// 内置1:  Extract
// 原理type MyExtract<T, U> = T extends U ? T : never;
// T 和 U 没有硬性的关系
type R6 = Extract<1 | 2 | 3, 1 | 2 | 4>; // 求差集 用第一个和第二个类型的公共部分

// Exclude排除类型(差集);
// 原理： type MyExclude<T, U> = T extends U ? never : T;
type R7 = Exclude<'1' | '2' | '3', '1' | '2'>;

// type NonNullable<T> = T extends null | undefined ? never : T;
type NonNullable<T> = T & {}; // 保留联合类型中非空的值
type MyNone = NonNullable<'a' | null | undefined>;

// 可以求联合类型的交集和差集  Extract, Exclude  后续可以求对象的属性的交集和差集

// infer 类型推断
// infer 可以在条件类型中提取类型的某一个部分， 在使用的时候想获取什么类型就将他写在什么“地方”加一个变量可以自动的来推导。类型推导都是基于位置的

// 1.获取函数的返回值类型
function getObj(name: string, age: number) {
  return { name, age };
}

// ReturnType原理： type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;

// 泛型约束的目的是限制泛型传入的，后面的条件是逻辑
type R9 = ReturnType<typeof getObj>; // 使用infer 需要先创造一个条件才可以

// Parameters 原理： type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;

// 泛型约束的目的是限制泛型传入的，后面的条件是逻辑
type R10 = Parameters<typeof getObj>; // 使用infer 需要先创造一个条件才可以

class Person {
  constructor(name: string, age: number) {}
}
// ConstructorParameters 原理： type ConstructorParameters<T extends new (...args: any[]) => any> = T extends { new (...args: infer R): any } ? R : never;
type MyConstructor = ConstructorParameters<typeof Person>; // 取类本身的类型来判断构造函数的参数

// InstanceType 原理： type InstanceType<T extends new (...args: any[]) => any> = T extends { new (...args: any): infer R } ? R : any;
type MyInstance = InstanceType<typeof Person>;

function createInstance<T extends new (...args: any[]) => any>(Ctor: T, ...args: ConstructorParameters<T>): InstanceType<T> {
  return new Ctor(...args);
}
class Animal {
  constructor(public name: string) {}
}
const animal = createInstance(Animal, '动物');

// 条件判断：T 是否是包含两个元素的元组
// infer A：推断元组第一个元素的类型并命名为 A
// infer B：推断元组第二个元素的类型并命名为 B
type Swap<T> = T extends [infer A, infer B] ? [B, A] : T;
type SwapS1 = Swap<['jw', 30]>; // [30, "jw"]
type SwapS2 = Swap<[1, 2, 3]>; // [1, 2, 3]
// 条件判断：T 是否是包含至少两个元素的元组
// infer A：推断元组第一个元素的类型并命名为 A
// ...infer Args：推断元组中间所有元素（除首尾外）的类型，打包为 Args 元组（剩余元组推断）
// infer B：推断元组最后一个元素的类型并命名为 B
type ReverseTuple<T extends any[]> =
  // 递归终止条件：空元组直接返回空
  T extends []
    ? []
    : // 递归逻辑：
      // 1. infer First：捕获当前元组第一个元素
      // 2. ...infer Rest：捕获剩余元素
      // 3. 重组：先递归倒序剩余元素，再把第一个元素拼到末尾
      T extends [infer First, ...infer Rest]
      ? [...ReverseTuple<Rest>, First]
      : T;
type R11 = ReverseTuple<[1, 2, 3, 4, 5, 6]>;

// promise 如果返回的是promise 会不停的解析，直到返回的不是promise 为止
// 递归推断
type PromiseVal<T> = T extends Promise<infer K> ? PromiseVal<K> : T;
type PromiseResult = PromiseVal<Promise<Promise<100>>>;

// 通过infer来实现递归推导
// 将元组转化成联合类型 [number, boolean, string] => number | boolean | string
type ElementToUnion<T> = T extends Array<infer E> ? E : T;

// 根据位置推导 [number, boolean, string] -> [E]
type TupleToArray = ElementToUnion<[number, boolean, string]>; // number | boolean | string

// Partial 转化可选属性
interface Company {
  num: number;
}
interface Person {
  name: string;
  age: string;
  company: Company;
}
// type Partial<T> = { [K in keyof T]?: T[K] }; 实现原理
type PartialPerson = Partial<Person>;
// 深度转化, 如果值是对象继续深度转化;
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
type DeepPartialPerson = DeepPartial<Person>;

// Required 转化必填属性
// Required 只有第一层就是将可选属性去掉
// 原理：type Required<T> = { [K in keyof T]-?: T[K] };
type RequiredPerson = Required<PartialPerson>;

// Readonly 转化只读属性
// 原理：type Readonly<T> = { readonly [K in keyof T]: T[K] };
type ReadonlyPerson = Readonly<PartialPerson>;

type Mutable<T> = { -readonly [K in keyof T]: T[K] }; // 所有属性变成可变属性
type MutablePerson = Mutable<ReadonlyPerson>;

// 内置类型有: 基于循环 （xxx in keyof T）
// Partial Required Readonly 属性修饰符？readonly
// Pick Omit Record

// Pick Omit  重构对象结构
// 原理： type Pick<T, U extends keyof T> = { [P in U]: T[P] };
// 在接口中挑选出指定的属性
type PickPerson = Pick<Person, 'name' | 'age'>;

// Omit 从接口中排除指定的属性
let person = {
  name: 'wang',
  age: 11,
  address: '回龙观'
};
// 原理： type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type OmitAddress = Omit<typeof person, 'address'>;

// 映射类型 Pick + Omit 配合 Extract 和 Exclude 可以实现各种类型
function mixin<T, K>(a: T, b: K): Omit<T, keyof K> & K {
  return { ...a, ...b };
}
const x = mixin({ name: 'wang', age: 30, a: 100 }, { age: '20', b: 200 });
// 映射类型 Computed 可以将所有属性都变成联合类型
type Computed<T> = { [K in keyof T]: T[K] };
type ComputedX = Computed<typeof x>; // { name: string; age: string; a: number; b: number; }

// keyof 取key
// typeof 取类型的
// 索引查询 []
// in 循环的
// extends 条件

// 只想要key -> value的格式 可以采用 Record类型
type Record<K extends keyof any, T> = { [P in K]: T };
let person1: Record<string, any> = { name: 'wang', age: 30 };
// 实现 map 方法，我们经常用 record 类型表示映射类型
function map<T extends keyof any, K, U>(obj: Record<T, K>, callback: (item: K, key: T) => U) {
  let result = {} as Record<T, U>;
  for (let key in obj) {
    result[key] = callback(obj[key], key);
  }
  return result;
}
const r = map({ name: 'wang', age: 30 }, (item, key) => {
  return item;
});

export {};
