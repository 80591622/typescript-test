type name = 'wang';
type sayHello1 = `hello, ${name}`; // hello, wang

// 类型分发机制 1)
type Direction = 'left' | 'right' | 'top' | 'bottom';
type AllMargin = `margin-${Direction}`; // "margin-left" | "margin-right" | "margin-top" | "margin-bottom"

// 类型分发机制 2)
type IColor = 'red' | 'yellow' | 'green';
type ICount = 100 | 200 | 300;
type BookSKU = `${IColor}-${ICount}`; // "red-100" | "red-200" | "red-300" | "yellow-100" | "yellow-200" | "yellow-300" | "green-100" | "green-200" | "green-300"

type sayHello<T extends string | number | bigint | boolean | null | undefined> = `hello, ${T}`; // 泛型要求：string | number | bigint | boolean| null | undefiend

type V1 = sayHello<'Wang'>; // "Hello, Wang"
type V2 = sayHello<30>; // "Hello, 30"
type V3 = sayHello<123n>; // "Hello, 123"
type V4 = sayHello<true>; // "Hello, true"
type V5 = sayHello<null>; // "Hello, null"
type V6 = sayHello<undefined>; // "Hello, undefined"
type v7 = sayHello<string>; // `hello, ${string}`
type v8 = sayHello<number>; // `hello, ${number}`

// 传入类型不会被解析，为所有`hello, `开头的父类型
type isChild = V1 extends v7 ? true : false;

// 对 key 进行重命名
type Person = { name: string; age: number; address: string };
type RenamePerson<T> = {
  [K in keyof T as `re_${K & string}`]: T[K]; // K & string 保证K为string类型
};
let person: RenamePerson<Person> = {
  re_name: 'wang',
  re_age: 30,
  re_address: '回龙观'
};

// 专用工具类型
// Uppercase、Lowercase、Capitalize 、Uncapitalize
type Person1 = { name: string; age: number; address: string };
type PersonWithGetter<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]?: () => T[K];
};
let person1: Person1 = { name: 'wang', age: 39, address: '回龙观' };
let personGetter: PersonWithGetter<Person> = {
  getName() {
    return person1.name;
  }
};

export {};
