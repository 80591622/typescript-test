// 我们知道了 条件运算符 就可以掌握ts中的兼容性 以及类型的层级
// 兼容性： 就是可以将一个值赋予给某个值
// 类型层级： 低的类型层级可以赋予给高的层级
type R1 = 'abc' extends string ? true : false; // true
type R2 = 123 extends number ? true : false; // true
type R3 = true extends boolean ? true : false; // true

// so~~~
let r1: string = 'abc';
let r2: number = 123;
let r3: boolean = true;

// 联合类型的兼容性    联合类型中所有成员在另一个联合类型中都能找到就是兼容
type R4 = 'a' extends 'a' | 'b' | 'c' ? true : false; // true
type R5 = 123 extends 123 | 456 | 789 ? true : false; // true
type R6 = string extends boolean | string | number ? true : false;

// so~~~
let r4: 'a' | 'b' | 'c' = 'a';
let r5: 123 | 456 | 789 = 123;
let temp = 'hello';
let r6: boolean | string | number = temp;

// 原始类型与装箱类型兼容性;
type R7 = string extends String ? true : false; // true
type R8 = number extends Number ? true : false; // true
type R9 = object extends Object ? true : false; // true
type R10 = String extends Object ? true : false; // true

// so~~~
let r7: String = 'abc';
let r8: Number = 123;
let r9: Object = {};
let r10: Object = new String('abc');

// any 和 unknown 即为顶级类型
type R11 = Object extends any ? true : false; // true
type R12 = Object extends unknown ? true : false; // true

// so~~~
let tempObj: Object = {};
let r11: any = tempObj;
let r12: unknown = tempObj;

// never 是任何类型的子类型，也就是最底端的类型
// null 和 undefined 在严格模式下不能赋予给其他类型。undefined 可以赋予给 void 类型
type R13 = never extends 'abc' ? true : false; // true
type R14 = undefined extends undefined ? true : false; // true
type R15 = null extends null ? true : false; // true
type R16 = undefined extends void ? true : false; // true

// any可以分解成条件满足、和不满足两部分，则返回条件类型结果组成的联合类型。但是与any 进行判断时依然会进行正常判断
type R17 = unknown extends 1 ? true : false; // 不能赋予给除unknown之外的类型
type R18 = any extends string ? true : false; // boolean
type R19 = any extends any ? true : false; // 条件是 any，依然会进行判断

// {} | object | Object 特殊情况
type R20 = {} extends object ? true : false; // true
type R21 = {} extends Object ? true : false; // true

// 结构上考虑  鸭子类型检测，可以看出对象是基于{}扩展出来的
type R22 = Object extends {} ? true : false; // true
type R23 = object extends {} ? true : false; // true

// ts 默认小的 object 和 大的 Object 都可以互相赋值
type R24 = Object extends object ? true : false; // true
type R25 = object extends Object ? true : false; // true

// 字面量类型可以赋予给字面量联合类型
// 字面量类型可以赋予给基础类型
// 基础类型是包装类型的子类型
// any 和 unknown 都是最大类型
// never < 字面量类型
// never < 字面量 < 字面量联合类型 | 字面量类型 < 基础数据类型 < 包装类型 < Object < any | unknown

export {};
