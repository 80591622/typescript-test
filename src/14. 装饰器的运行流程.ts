function Echo(val: string): any {
  return () => {
    console.log(val);
  };
}
@Echo('类装饰器1') // 类装饰器是兜底执行
@Echo('类装饰器2') // 类装饰器是兜底执行
@Echo('类装饰器3') // 类装饰器是兜底执行
@Echo('类装饰器4') // 类装饰器是兜底执行
class Flow {
  constructor(@Echo('构造函数参数装饰器') str: string) {}
  @Echo('静态方法装饰器')
  static getType(@Echo('静态方法参数装饰器') str: string) {
    return this.type;
  }
  @Echo('静态属性装饰器')
  static type = 'hello';

  @Echo('实例方法装饰器')
  handler(@Echo('实例方法参数装饰器') str: string) {}

  @Echo('实例属性装饰器')
  name!: string;

  @Echo('属性访问装饰器')
  get value() {
    return 'hello';
  }
}

// [实例属性、方法（优先执行参数装饰器）、属性访问]、[静态属性、静态方法]、构造函数参数装饰器、类装饰器 (同时使用多个装饰器的执行流程“洋葱模型”)

// 实例方法参数装饰器
// 实例方法装饰器
// 实例属性装饰器
// 属性访问装饰器
// 静态方法参数装饰器
// 静态方法装饰器
// 静态属性装饰器
// 构造函数参数装饰器
// 类装饰器4
// 类装饰器3
// 类装饰器2
// 类装饰器1

export {};
