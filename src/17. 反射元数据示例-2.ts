const VALIDATION_KEY = Symbol('VALIDATION_KEY');
const REQUIRED_KEY = Symbol('REQUIRED_KEY');
enum Type {
  String = 'string',
  Number = 'number'
}

function Required(): PropertyDecorator {
  return (target, prop) => {
    const requiredKeys: string[] = Reflect.getMetadata(REQUIRED_KEY, target) || [];
    // 设置元数据
    Reflect.defineMetadata(REQUIRED_KEY, [...requiredKeys, prop], target);
  };
}

function ValueType(type: Type) {
  return (target: any, prop: string) => {
    // 给某个属性添加元数据
    Reflect.defineMetadata(VALIDATION_KEY, type, target, prop);
  };
}

class Person {
  @ValueType(Type.Number) // 值的类型应为number
  @Required()
  age!: number;
}
const instance = new Person();
// @ts-ignore
instance.age = '18';

function validate(instance: any) {
  let exisitsKeys = Reflect.ownKeys(instance); // 获取已经存在的属性
  let requiredKeys = Reflect.getMetadata(REQUIRED_KEY, instance) || [];
  for (let key of exisitsKeys) {
    let validations = Reflect.getMetadata(VALIDATION_KEY, instance, key);
    if (validations) {
      // 看存在的类型是否满足
      if (typeof instance[key] !== validations) {
        throw new Error(`${String(key)} expect ${validations}`);
      }
    }
  }
  // 校验必填属性，看实例上是否存在需要的必填属性
  for (const key of requiredKeys) {
    if (!exisitsKeys.includes(key)) {
      throw new Error(key + ' is required');
    }
  }
}
validate(instance);

export {};
