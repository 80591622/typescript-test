// 实例上的属性需要先声明在使用，构造函数中的参数可以使用可选参数和剩余参数
class Circle {
  x: number; // 实例上的属性必须先声明
  y: number;
  constructor(x: number, y: number = 0, ...args: number[]) {
    this.x = x;
    this.y = y;
  }
}
let circle = new Circle(100);
console.log(circle);

/**
 * 修饰符示例：
 * 1. public修饰符（公开属性）
 * 2. private修饰符（私有属性）
 * 3. protected修饰符（受保护属性）
 * 4. readonly修饰符（只读属性）
 */

// 1. 基本类定义示例
class BasicAnimal {
  public name!: string; // 不写public默认也是公开的
  public age!: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
class DomesticCat extends BasicAnimal {
  constructor(name: string, age: number) {
    super(name, age);
    console.log(this.name, this.age);
  }
}
let domesticCat = new DomesticCat('Tom', 18);
console.log(domesticCat.name, domesticCat.age); // 外层可以访问public属性

// 2. 通过参数属性简化代码
class People {
  constructor(
    public name: string,
    public age: number
  ) {
    // 参数属性自动创建和初始化成员变量
  }
}
let people = new People('Alice', 25);
console.log(people.name, people.age);

// 3. protected修饰符示例 只能自己和子类中访问
class ProtectedAnimal {
  // #region constructor
  constructor(
    protected name: string,
    protected age: number
  ) {
    this.name = name;
    this.age = age;
  }
  // #endregion
}
class Dog extends ProtectedAnimal {
  constructor(name: string, age: number) {
    super(name, age);
    console.log(this.name, this.age); // 子类可以访问protected属性
  }
}
let dog = new Dog('Buddy', 3);
// console.log(dog.name, dog.age); // 外层无法访问protected属性

// 4. private修饰符 （除了自己都访问不到）
class Person {
  constructor(
    private id: number,
    private name: string
  ) {
    this.id = id;
    this.name = name;
  }

  getId() {
    return this.id; // 类内部可以访问private属性
  }
}
let person = new Person(110, 'Bob');
// console.log(person.name);
console.log(person.getId());

// 5. readonly修饰符 （只读属性）
// readonly 在构造函数中可以随意修改（初始化） 在其他的地方就不能再次修改了
class ReadonlyAnimal {
  constructor(
    public readonly name: string,
    public age: number
  ) {
    this.name = 'init';
    this.age = age;
  }
  changeName(name: string) {
    // this.name = name; // 错误：仅读属性只能在constructor中被赋值
    return this.name;
  }
}
class ReadonlyCat extends ReadonlyAnimal {
  constructor(name: string, age: number) {
    super(name, age);
  }
}
let readonlyCat = new ReadonlyCat('Tom', 18);
console.log(readonlyCat.changeName('Jerry')); // 无法修改只读属性

// 静态属性和静态方法是可以被子类所继承的;
class StaticAnimal {
  static type = '哺乳动物'; // 静态属性
  static getName() {
    // 静态方法
    return '动物类';
  }
  private _name: string = 'Tom';
  get name() {
    // 属性访问器
    return this._name;
  }
  set name(name: string) {
    this._name = name;
  }
}
let staticAnimal = new StaticAnimal();
console.log(staticAnimal.name);
console.log(StaticAnimal.type); // 访问静态属性
console.log(StaticAnimal.getName()); // 调用静态方法

// 继承与super关键字示例
class InheritanceAnimal {
  say(message: string) {
    console.log(message);
  }
  static getType() {
    return '动物';
  }
}
class InheritanceCat extends InheritanceAnimal {
  say() {
    // 原型方法中的super指代的是父类的原型
    super.say('猫猫叫');
  }
  static getType() {
    // 静态方法中的super指代的是父类
    return super.getType();
  }
}
let inheritanceCat = new InheritanceCat();
inheritanceCat.say();
console.log(InheritanceCat.getType());

// 单例模式示例 - 演示私有构造函数的作用

/**
 * Singleton类 - 实现单例模式
 *
 * 单例模式是一种创建型设计模式，它确保一个类只有一个实例，并提供一个全局访问点来获取这个实例。
 */
class Singleton {
  // 1. 私有静态属性，用于存储类的唯一实例
  private static instance = new Singleton();

  /**
   * 私有构造函数
   *
   * 作用：
   * 1. 阻止外部代码直接使用 new 关键字创建类的实例
   * 2. 确保类的实例只能通过类内部的静态方法创建
   * 3. 控制实例的创建过程和数量
   */
  private constructor() {
    console.log('Singleton实例被创建');
  }

  /**
   * 公共静态方法 - 获取类的唯一实例
   *
   * 这是外部代码获取Singleton实例的唯一途径
   */
  public static getInstance() {
    return Singleton.instance;
  }
}

// 测试单例模式
// 尝试直接实例化会报错：Constructor of class 'Singleton' is private and only accessible within the class declaration.
// const instance = new Singleton(); // 编译错误

// 通过静态方法获取实例
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

// 验证两个实例是否为同一个对象（引用相等）
console.log(instance1 == instance2); // 输出: true - 证明单例模式生效

/**
 * 抽象类(Abstract Class)示例
 *
 * 抽象类是一种不能直接实例化的特殊类，主要用于定义接口和共享的行为。
 * 它的主要作用是作为子类的基类，提供公共的属性和方法定义。
 */
abstract class AbstractAnimal {
  // 抽象类中不能定义抽象静态属性
  // abstract static type = '哺乳动物' // 编译错误：“static”修饰符不能与“abstract”修饰符一起使用

  /**
   * 抽象方法
   *
   * 特点：
   * 1. 抽象方法只有方法签名，没有具体实现
   * 2. 所有继承抽象类的非抽象子类必须实现所有抽象方法
   * 3. 抽象方法可以是实例方法或原型方法
   */
  abstract eat: () => void; // 抽象实例方法（箭头函数形式）
  abstract play(): void; // 抽象原型方法（传统函数形式）

  /**
   * 具体方法
   *
   * 抽象类中可以包含具有完整实现的具体方法
   * 子类可以直接继承使用，也可以选择重写
   */
  drink() {
    return '喝水';
  }
}

/**
 * 具体子类
 *
 * 继承自抽象类的非抽象子类必须：
 * 1. 实现所有抽象方法
 * 2. 可以使用或重写抽象类中的具体方法
 */
class Tom extends AbstractAnimal {
  // 实现抽象实例方法
  eat = () => {
    console.log('Tom在吃东西');
  };

  // 实现抽象原型方法
  play() {
    console.log('Tom在玩');
  }

  // 重写父类的具体方法
  drink() {
    return 'Tom在喝水';
  }
}

// 测试抽象类
// 尝试直接实例化抽象类会报错：Cannot create an instance of an abstract class.
// const animal = new AbstractAnimal(); // 编译错误

// 创建子类实例
const tom = new Tom();
tom.eat(); // 调用实现的抽象方法
tom.play(); // 调用实现的抽象方法
console.log(tom.drink()); // 调用重写的具体方法

/**
 * 函数重载(Function Overloading)概念解释
 *
 * 函数重载是TypeScript提供的一种类型系统特性，它允许：
 * 1. 为同一个函数定义多个不同的参数类型和返回类型组合
 * 2. 提供更精确的类型检查和智能提示
 * 3. 使函数能够处理多种不同的输入/输出组合
 *
 * 实现方式：
 * 1. 定义多个函数签名（重载签名）
 * 2. 提供一个实现签名和具体实现
 *
 * 注意：
 * - 重载签名只包含参数类型和返回类型，没有函数体
 * - 实现签名必须兼容所有重载签名
 * - TypeScript会根据传入的参数类型选择最合适的重载签名
 */

/**
 * ToArrayConverter类
 *
 * 该类演示了TypeScript中函数重载的实际应用，
 * 提供了将不同类型的值转换为数组的功能。
 */
class ToArrayConverter {
  /**
   * 将数字转换为数字数组
   * @param value 要转换的数字
   * @returns 数字数组，每个元素是输入数字的各位数字
   */
  convert(value: number): number[];

  /**
   * 将字符串转换为字符数组
   * @param value 要转换的字符串
   * @returns 字符串数组，每个元素是输入字符串的单个字符
   */
  convert(value: string): string[];

  /**
   * 实现签名和具体实现
   *
   * 注意：
   * 1. 实现签名必须使用联合类型兼容所有重载签名
   * 2. 实现签名不能直接调用，只能通过重载签名调用
   * 3. 实现内部需要处理所有可能的参数类型
   */
  convert(value: number | string): number[] | string[] {
    if (typeof value === 'string') {
      // 处理字符串类型：使用split('')将字符串拆分为字符数组
      return value.split('');
    } else {
      // 处理数字类型：将数字转换为字符串，然后拆分为字符数组，最后转换为数字数组
      return value
        .toString() // 转换为字符串
        .split('') // 拆分为字符数组
        .map((item) => Number(item)); // 转换为数字数组
    }
  }
}

// 测试函数重载
const converter = new ToArrayConverter();

// 调用数字版本的convert方法
const result1: number[] = converter.convert(123);
console.log(result1); // 输出: [1, 2, 3]

// 调用字符串版本的convert方法
const result2: string[] = converter.convert('123');
console.log(result2); // 输出: ['1', '2', '3']

// 类型安全：TypeScript会根据参数类型推断返回类型
// const result3: number[] = converter.convert('123'); // 编译错误：类型 'string[]' 不能赋值给类型 'number[]'
