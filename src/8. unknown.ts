// unknown类型，任何类型都可以赋值为unknown类型。 它是 any 类型对应的安全类型。any 叫做不检测了， unknown 要进行类型检测

// 类型检查后使用
function processInput(input: unknown) {
  if (typeof input === 'string') {
    console.log(input.toUpperCase());
  } else if (typeof input === 'number') {
    console.log(input.toFixed(2));
  } else {
    console.log(input); // unknown
  }
}
// 类型断言后使用
let name: unknown = 'wang';
(name as string).toUpperCase();

// 联合类型与unknown都是unknown类型
type UnionUnknown = unknown | null | string | number;
// type inter = unknown & null; // null
// type inter = any & null; // any
// type inter = unknown & string; // string

// 不能用unknown类型来索引
type key = keyof unknown; // never
// type key = keyof any; // string | number | symbol

export {};
