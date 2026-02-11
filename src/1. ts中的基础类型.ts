// 类型分类： 基础类型、高级类型、自定义类型、内置类型、类型体操

/**
 *
 * 1. ts 类型要考虑安全性，一切从安全角度上触发。
 * 2. ts 在使用的时候程序还没有运行
 * 3. ts 中有类型推导， 会自动根据赋予的值来返回类型，只有无法推到或者把某个值赋予给某个变量的时候我们需要添加类型。
 *
 */
let name: string = 'ke';
let age: number = 18;
let isMale: boolean = true;

/**
 *
 * 我们标识类型的时候 原始数据类型全部用小写的类型，
 * 如果描述实例类型则用大写类型（大写类型就是装箱类型，其中也包含拆箱类型）
 * 在使用原始数据类型时，调用原始数据类型上的方法，默认会将原始数据类型包装成对象类型。
 *
 */
let s1: string = 'abc';
// let s2: string = new String('abc'); // 不支持
let s3: String = new String('abc');
let s4: String = 'abc';

/**
 *  1. (string | number | boolean)[]
 *  2. Array<number | string | boolean>
 */

let arr: number[] = [1, 2, 3];
let arr1: (string | number | boolean)[] = [1, 2, 3, 'ke', true];
let arr2: Array<number | string | boolean> = [1, 2, 3, 'ke', false];

/**
 *  固定长度 固定类型的一个数组
 *
 */

let tuple: [string, number, boolean] = ['ke', 18, false];
tuple.push('ke'); // ✅ 像元组中增加数据，只能增加元组中存放的类型，但是为了安全依然无法取到新增的属性
// tuple.push({ address: '回龙观' }); // ❌ 不能增加其他类型的数据
console.log(tuple);

// 具名元祖
let tuple1: [name: string, age: number, isMale: boolean] = ['ke', 18, false];

// 仅读元组 不能修改，同时会禁用掉修改数组的相关方法
let tuple2: readonly [string, number, boolean] = ['ke', 18, false];
// tuple2.push('beijing'); // ❌ 不能增加数据

// 枚举 枚举是一种特殊的类型，它可以定义一个集合，集合中的每个元素都有一个唯一的名称。
const enum USER_ROLE {
  USER, // 默认从0开始
  ADMIN,
  MANAGER
}
// 异构枚举 枚举中可以混合使用字符串和数字
// enum USER_ROLE {
//   USER = 'user',
//   ADMIN = 1,
//   MANAGER // 2
// }
console.log(USER_ROLE.USER);

// 默认情况下 只能null给null ， undefined给undefined
let u1: undefined = undefined;
let n1: null = null; // 默认情况下 只能null给null ， undefined给undefined

// 如果TSconfig配置中strictNullChecks的值为 true，则不能把 null 和 undefined 赋给其他类型
let name1: number | boolean;
// name1 = null;
// name1 = undefined; // 非严格模式

function fn1() {}
function fn2() {
  return;
}

// 严格模式下不能将 null 赋予给 void
function fn3(): void {
  return undefined;
}

function fn(): never {
  // throw new Error();
  while (true) {}
}
let a: never = fn(); // never只能赋予给never
let b: number = a; // never是任何类型的子类型，可以赋值给任何类型

// never 类型表示「永不存在的值的类型」，不能作为普通函数的参数类型
function validate(type: never) {} // 类型“boolean”的参数不能赋给类型“never”的参数。
function getResult(strOrNumOrBool: string | number | boolean) {
  if (typeof strOrNumOrBool === 'string') {
    return strOrNumOrBool.split('');
  } else if (typeof strOrNumOrBool === 'number') {
    return strOrNumOrBool.toFixed(2);
  }
  // 不能将类型“boolean”分配给类型“never”。
  // validate(strOrNumOrBool);
}

let noNever: string | number | boolean | never = 1; // never自动过滤
console.log(noNever, '-----noNever');

/**
 * object、Object、{} 的区别
 * 1. object非原始类型；
 * 2. Object所有值都可以赋予给这个包装类型；
 * 3. {}字面量对象类型
 *
 * @param obj:不能使用大写的Object或 {} 作为类型，因为Object是一个全局对象，而object是一个原始类型。
 */
let create = (obj: object) => {};
create({});
create([]);
create(function () {});

// Symbol 表示独一无二
const a1 = Symbol('key');
const a2 = Symbol('key');
// console.log(a1 === a2);  // false

const num1 = Number.MAX_SAFE_INTEGER + 1;
const num2 = Number.MAX_SAFE_INTEGER + 2;
console.log(num1 == num2); // true
// number类型和bigInt类型是不兼容的
let max: bigint = BigInt(Number.MAX_SAFE_INTEGER);
console.log(max + BigInt(1) === max + BigInt(2));

// 不进行类型检测，一旦写了 any 之后任何的校验都会失效
let arr3: any = ['jw', true];
arr3 = '回龙观';

// 声明变量没有赋予值时默认变量是any类型
let name3;
name3 = 'wk';
name3 = 123;
name3 = false;
// 声明变量赋值时则以赋值类型为准
let name4 = 123;
// name4 = 'wk';

// 使用联合类型时没有赋值只能使用变量的公共方法
let name5: number | string;
name5 = 'wk';
name5 = 123;
console.log(name.toString()); // 公共方法
// console.log(name.toFixed(2)); // ❌ number方法

export {};
