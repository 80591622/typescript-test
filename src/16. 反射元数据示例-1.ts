// 引入 reflect-metadata 库：用于在类/对象上定义和读取元数据（需先安装：pnpm install reflect-metadata）
import 'reflect-metadata';

// 定义元数据的唯一标识 Symbol：避免与其他元数据冲突，用于标记“必填属性”
const REQUIRED_KEY = Symbol('required_key');

/**
 * Required 装饰器：属性装饰器，标记类的属性为“必填项”
 * @returns PropertyDecorator - 属性装饰器类型（接收目标对象、属性名两个参数）
 */
function Required(): PropertyDecorator {
  // 装饰器函数返回实际的装饰逻辑
  return (target, prop) => {
    // 1. 先从目标对象（类的原型）上读取已有的必填属性列表，若无则初始化为空数组
    const requiredKeys: string[] = Reflect.getMetadata(REQUIRED_KEY, target) || [];
    // 2. 将当前装饰的属性名加入必填列表，并重新设置元数据
    Reflect.defineMetadata(REQUIRED_KEY, [...requiredKeys, prop], target);
  };
}

/**
 * 测试类：使用 @Required 装饰器标记 name 和 age 为必填属性
 */
class Person {
  @Required() // 标记 name 属性为必填
  name!: string;
  @Required() // 标记 age 属性为必填
  age!: number;
}

/**
 * 校验函数：检查实例的必填属性是否都已赋值
 * @param instance - 待校验的类实例
 * @throws Error - 若有必填属性未赋值，则抛出错误
 */
function validate(instance: any) {
  // 1. 获取实例上已存在的属性名（包括自身定义的所有属性）
  let exisitsKeys = Reflect.ownKeys(instance);
  // 2. 从实例的原型上读取标记的必填属性列表（若无则初始化为空数组）
  // 注意：元数据存在于类的原型上，而非实例本身，因此需取 instance.constructor.prototype
  let requiredKeys = Reflect.getMetadata(REQUIRED_KEY, instance.constructor.prototype) || [];

  // 3. 遍历必填属性列表，检查是否都存在于实例中
  for (const key of requiredKeys) {
    if (!exisitsKeys.includes(key)) {
      throw new Error(key + ' is required'); // 未找到则抛出必填错误
    }
  }
}

// ========== 核心逻辑执行流程 ==========
// 1）通过 @Required 装饰器记录 Person 类的 name、age 为必填属性（存储到元数据中）
// 2）创建 Person 实例并赋值
const person = new Person();
person.name = 'wang';
person.age = 30;

// 3）调用 validate 校验实例：检查必填属性是否都已赋值
validate(person); // 校验通过，无报错；若注释掉 name/age 赋值，则会抛出 "name is required"/"age is required"
