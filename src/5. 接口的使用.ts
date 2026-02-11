/**
 * 函数类型声明示例
 *
 * 以下代码演示了为函数声明类型的不同方式
 */

// 方式1：内联类型注解 - 直接在参数和返回值上声明类型
// const fullName = ({ firstName, lastName }: { firstName: string; lastName: string }): string => {
//   return firstName + lastName;
// };

// 方式2：使用接口约束参数类型
// interface IFullName {
//   firstName: string;
//   lastName: string;
// }
// const fullName = ({ firstName, lastName }: IFullName): string => {
//   return firstName + lastName;
// };

// 方式3：使用函数接口约束整个函数类型（推荐）
// 定义参数接口
interface IFullName {
  firstName: string;
  lastName: string;
}

// 定义函数接口
interface IFn {
  (obj: IFullName): string;
}

// 实现函数，使用函数接口进行约束
const fullName: IFn = ({ firstName, lastName }) => {
  return firstName + lastName;
};

/**
 * 函数类型接口与函数属性示例
 *
 * 以下代码演示了如何定义包含函数类型和属性的接口
 */

// 定义包含函数类型和属性的接口
interface ICounter {
  (): number; // 定义函数类型：无参数，返回number
  count: number; // 定义函数上的属性：count，类型为number
}

// 创建符合ICounter接口的函数
const counterFn: ICounter = () => {
  // 注意：必须使用const声明函数，防止函数被重新赋值
  // 因为如果用let重新赋值，新的函数可能没有count属性
  return counterFn.count++;
};

// 初始化函数属性
counterFn.count = 0;

// 使用类型断言确保counter变量符合ICounter接口
let counter: ICounter = counterFn;

// 测试函数
console.log(counter()); // 输出: 0 (先返回count值，再递增)
console.log(counter()); // 输出: 1 (先返回count值，再递增)

/**
 * 
    interface IVegetables {
      // 类型
      color: string;
      taste: string;
      size: number;
    }
    let veg1: IVegetables = {
      // 定义
      color: 'red',
      taste: 'sweet',
      size: 10,
      a: 1, // 如何增添这个a属性呢？
    };
 */

/**
 * 方案 1：直接采用断言的方式指定为当前赋值的类型
 * 方案 2：在类型中通过?增添 a 属性为可选属性
 * 方案 3：利用同名接口合并的特点
 * 方案 4：通过接口继承的方式扩展属性
 * 方案 5：通过任意接口来扩展
 * 类型兼容性、交叉类型等
 */

interface IVegetables {
  readonly color: string;
  size: string;
  taste: 'sour' | 'sweet';
}
interface IVegetables {
  a?: number;
}
const tomato: IVegetables = {
  color: 'red',
  size: '10',
  taste: 'sour'
};
// tomato.color = 'green'; // 仅读属性不能进行修改

/**
 * 包含索引签名的接口示例
 *
 * 注意：
 * 1. 字符串索引签名 `[key: string]: any` 仅支持字符串键的属性
 * 2. 要支持 Symbol 键，需要添加 Symbol 索引签名 `[key: symbol]: any`
 * 3. 接口中可以同时存在字符串索引签名和 Symbol 索引签名
 */
interface IPerson {
  name: string; // 必选属性
  [key: string]: any; // 字符串索引签名：允许任意字符串键的属性
  [key: symbol]: any; // Symbol 索引签名：允许任意 Symbol 键的属性
}

// ============= 第一部分：Symbol 键的任意属性（IPerson 接口） =============
// 1. 创建一个唯一的 Symbol（用于对象的唯一键名，避免属性名冲突）
const addressSymbol = Symbol('address');

// 2. 定义 IPerson 接口：包含必填属性 + 任意属性（支持字符串键/Symbol键）
interface IPeople {
  // 必填属性：姓名（字符串类型）
  name: string;
  // 必填属性：年龄（数字类型）
  age: number;
  // 任意属性：支持字符串作为键的任意类型属性（兼容常规字符串键）
  [key: string]: any;
  // 任意属性：支持 Symbol 作为键的任意类型属性（兼容 Symbol 键）
  [key: symbol]: any;
}

// 3. 声明变量 person（替换重复的 p），赋值 IPerson 类型的对象
let people1: IPeople = {
  name: 'xiaoming', // 必填属性：姓名
  age: 30, // 必填属性：年龄（同时满足字符串键的任意属性约束）
  [addressSymbol]: '回龙观' // Symbol 键的任意属性：地址
};

// 4. 访问 Symbol 键的属性（Symbol 作为键需用 [] 访问）
console.log(people1[addressSymbol]); // 输出: 回龙观

// ============= 第二部分：数字索引的可索引接口（IArr 接口） =============
/**
 * 可索引接口 IArr：限制对象/数组的键为数字类型，值为任意类型
 * 作用：约束「数字作为键」的集合（兼容对象形式的数组、原生数组）
 */
interface IArr {
  // 数字索引签名：key 必须是 number 类型，值可以是任意类型
  [key: number]: any;
}

// 5. 声明变量 objArr（替换重复的 p）：对象形式的数字索引集合
let objArr: IArr = {
  0: '1', // 数字键 0，值为字符串
  1: '2', // 数字键 1，值为字符串
  3: '3' // 数字键 3，值为字符串（键不连续也符合约束）
};

// 6. 声明变量 arr：原生数组（数组的索引本质是数字，符合 IArr 约束）
let arr: IArr = [1, 'd', 'c']; // 数组元素类型可以任意（number/string 都兼容 any）

interface IPerson1 {
  name: string;
  age: number;
  [key: string]: any;
}
// 访问接口中的类型需要使用[], 不能使用.
type PropType1 = IPerson1['name'];
type PropType2 = IPerson1[string];

interface IPerson2 {
  name: string;
  age: number;
}
type PropTypeUnion = keyof IPerson2; // name | age
type PropTypeValueUnion = IPerson2[PropTypeUnion]; // string | number

// 抽象类和接口的区别, 抽象类中可以包含具体方法实现，接口中不能包含实现
// 一个类可以实现多个接口，在类中必须实现接口中的方法和属性
interface Speakable {
  name: string;
  speak(): void;
}
// 这里不区分是实例的方法还是原型的方法
interface ChineseSpeakable {
  // speakChinese:()=>void
  speakChinese(): void; // 一般采用这种方式，这种方式不进行逆变检测
}
class Speak implements Speakable, ChineseSpeakable {
  name!: string;
  speak() {}
  speakChinese() {}
}

// 接口继承的方式实现多继承
// 基础接口：定义“可说话”的核心行为（语义更清晰：Speakable → Talkable）
interface Talkable {
  // 通用说话方法（无具体语言限制）
  talk(): void;
}

// 继承基础接口：定义“说中文”的专属行为（语义优化：SpeakChinese → ChineseTalkable）
interface ChineseTalkable extends Talkable {
  // 说中文的专属方法
  talkChinese(): void;
}

// 实现接口的类：语义化命名（Speak → ChineseSpeaker，代表“说中文的人/对象”）
class ChineseSpeaker implements ChineseTalkable {
  // 实现“说中文”方法（补充具体逻辑，替换原错误抛出）
  talkChinese(): void {
    console.log('你好，我会说中文！');
  }

  // 实现通用“说话”方法（补充具体逻辑）
  talk(): void {
    console.log('我是一个能说话的对象！');
  }
}

// 测试实例化（新增：验证代码可运行）
const speaker = new ChineseSpeaker();
speaker.talk(); // 输出：我是一个能说话的对象！
speaker.talkChinese(); // 输出：你好，我会说中文！
