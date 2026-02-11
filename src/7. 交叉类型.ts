// 交叉类型(Intersection Types)是将多个类型合并为一个类型

// 联合类型的符号是|，类似按位或。只需要符合联合类型中的一个类型即可。 （并集）
// 交叉类型的符号是&，类似按位与。需同时满足类型。 （交集）

interface Person1 {
  handsome: string;
}
interface Person2 {
  high: string;
}
type Person3 = Person1 & Person2;
let p: Person3 = { handsome: '帅', high: '高' };

// 交叉类型如果有类型冲突，会出现never类型
interface Person4 {
  handsome: string;
  address: {
    pos: string; // 如果类型冲突会出现never
  };
}
interface Person5 {
  high: string;
  address: {
    pos: number; // 如果类型冲突会出现never
  };
}
type P1P2 = Person4 & Person5; // address 内部也会进行交叉类型
type POS = P1P2['address']['pos']; // never = string & number

// 这里返回值默认会被识别成交叉类型，但是如果两个对象中有相同属性类型不同，则默认推导会出现问题
function mixin<T, K>(a: T, b: K) {
  return { ...a, ...b };
}
const x = mixin({ name: 'wang', age: 30 }, { age: '20' });
