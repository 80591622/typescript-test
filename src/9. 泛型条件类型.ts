// 使用extends关键字和三元表达式，实现条件判断。条件类型大部分场景是和泛型一起使用的
type ResStatusMessage<T extends number> = T extends 200 | 201 | 204 ? 'success' : 'fail';
type Message = ResStatusMessage<200>; // 传入要判断的类型

type Conditional<T, K> = T extends K ? true : false;
type R1 = Conditional<'wang', string>; // true
type R2 = Conditional<'wang', number>; // false 条件也可以通过泛型传入

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
type Condition<T> = T extends Bird ? Water : Sky; // 类型相同也可以使用extends
let con1: Condition<Fish> = { type: '天空' };

// 多条件泛型
type FormatReturnType<T> = T extends string // 可以编写多条件类型
  ? string
  : T extends number
    ? number
    : never;

function sum<T extends string | number>(x: T, y: T): FormatReturnType<T> {
  // 如果不断言，泛型不能做运算
  return x + (y as any); // T + T?
}
sum('abc', 'abc'); // string
sum(123, 123); // number

export {};
