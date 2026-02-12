// 装饰器本质就是一个函数，只能在类以及类成员上使用。
// TypeScript 中的装饰器可以分为类装饰器、方法装饰器、访问符装饰器、属性装饰器以及参数装饰器
// 类装饰器是直接作用在类上的装饰器，它在执行时的入参只有一个，即是这个类本身。
// 如果装饰器函数中返回一个新的类，那么即是这个类的子类，这个子类可以用于重写父类
const Decorator = <T extends { new (...args: any[]): {} }>(target: T) => {
  (target as any).type = '动物';
  (target as any).getType = function () {
    return this.type;
  };
  Object.assign(target.prototype, {
    eat() {
      console.log('eat');
    },
    drink() {
      console.log('drink');
    }
  });
};
interface Animal1 {
  eat(): void;
  drink(): void;
}
@Decorator
class Animal1 {}
const animal1 = new Animal1();

// 原型方法
animal1.eat();
animal1.drink();
// 静态方法
console.log((Animal1 as any).getType());

// 通过返回子类的方式进行扩展
const OverrideAnimal = (target: any) => {
  return class extends target {
    // 通过返回子类的方式对父类进行装饰。 最终会用子类替代target
    eat() {
      super.eat();
      console.log('Override eat');
    }
    drink() {
      console.log('Overrided drink');
    }
  };
};

@OverrideAnimal
class Animal2 {
  eat() {
    console.log('eat');
  }
}
const animal2 = new Animal2();
animal2.eat();
(animal2 as any).drink();

// 方法装饰器的入参包括类的原型、方法名以及方法的属性描述符（PropertyDescriptor）
function Enum(isEnum: boolean): MethodDecorator {
  // 类的原型、方法名、方法属性描述符
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    // descriptor.enumerable   是否可枚举
    // descriptor.writable     是否可写
    // descriptor.configurable 是否能被删除
    // descriptor.value        原来的值
    descriptor.enumerable = isEnum; // 更改属性描述符
    let originalEat = descriptor.value as any;
    descriptor.value = function (...args: any[]) {
      console.log('prev-eat');
      originalEat.call(this, ...args);
      console.log('next-eat');
    };
  };
}

class Animal3 {
  @Enum(true)
  eat() {
    console.log('eat');
  }
}
const animal3 = new Animal3();
animal3.eat();

// 访问符装饰器本质上仍然是方法装饰器，它们使用的类型定义相同。
// 访问符装饰器只能应用在 getter / setter 的其中一个
// （装饰器入参中的属性描述符都会包括 getter 与 setter 方法：）
function ValueToUpper(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.set;
  descriptor.set = function (newValue: string) {
    original?.call(this, newValue.toUpperCase());
  };
}

class Animal4 {
  private _value!: string;
  @ValueToUpper //将设置的值转换成大写
  get value() {
    return this._value;
  }
  set value(newValue: string) {
    this._value = newValue;
  }
}
const animal4 = new Animal4();
animal4.value = 'hello world';
console.log(animal4.value);

// 参数装饰器包括了构造函数的参数装饰器与方法的参数装饰器，它的入参包括类的原型、参数所在的方法名与参数在函数参数中的索引值
function Params(target: any, key: string, index: number) {
  // 类的原型、 参数名、参数索引
  console.log(target, key, index);
}
class Animal {
  public name: string = 'Animal'; // 触发原型属性上的set方法
  play(@Params val: string) {
    console.log(val);
  }
}

export {};
