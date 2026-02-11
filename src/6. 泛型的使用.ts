// 泛型示例
interface Class<T> {
  new (name: string): T;
}
function createClass<T>(target: Class<T>, name: string): T {
  return new target(name);
}
class Animal {
  constructor(public name: string) {
    this.name = name;
  }
}
let r = createClass(Animal, 'Tom');

// 单个泛型传参
const getArray = <T>(times: number, val: T): T[] => {
  let result: T[] = [];
  for (let i = 0; i < times; i++) {
    result.push(val);
  }
  return result;
};
getArray(3, 3); // 3 => T => number

// 多个泛型传参, 用于交换元组的元素类型
function swap<T, K>(tuple: [T, K]): [K, T] {
  return [tuple[1], tuple[0]];
}
console.log(swap(['wangke', 30]));

// 类型别名
type TArray = <T, K>(tuple: [T, K]) => [K, T];
const swapArr: TArray = <T, K>(tuple: [T, K]): [K, T] => {
  return [tuple[1], tuple[0]];
};

// 接口也可以定义泛型,对于函数而言我们通常采用类型别名的方式
interface IArray {
  <T, K>(tuple: [T, K]): [K, T];
}
const swapArray: IArray = <T, K>(tuple: [T, K]): [K, T] => {
  return [tuple[1], tuple[0]];
};

// type ICallback = <T>(item: T, index: number) => void; ❎错误写法，这样写意味着调用函数的时候确定泛型
// 正确写法，调用函数的时候才确定泛型
type ICallback<T> = (item: T, index: number) => void;
type IForEach = <T>(arr: T[], callback: ICallback<T>) => void;

const forEach: IForEach = (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i); // ts 类型检测 此时不会执行代码。
  }
};
forEach([1, 2, 'a', 'b'], function (item) {
  console.log(item);
});

// 默认泛型参数
type Union<T = string> = number | T;
const u1: Union = 'abc';
const u2: Union<boolean> = true;

// 使用 extends 关键字来约束传入的泛型参数必须符合要求。A extends B 意味着 A 是 B 的子类型
// 'abc' extends string
// 'a' extends 'a' | 'b'
// 案例1：处理字符串或数字类型的输入
function handle<T extends string | number>(input: T): T {
  return input;
}

// 案例2：获取对象的属性值
interface IWithLength {
  length: number;
}
function getLen<T extends IWithLength>(val: T) {
  return val.length;
}
getLen('hello');

// 案例3：获取对象的属性值 keyof遍历{ name: 'jw', age: 15 } 得到 'name' | 'age'，
// 然后用 extends 约束 key 必须是 'name' | 'age' 中的一个
const getVal = <T, K extends keyof T>(obj: T, key: K): T[K] => {
  return obj[key];
};
getVal({ name: 'jw', age: 15 }, 'name');

interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
}

interface LoginRes {
  // 登录接口的返回值
  token: string;
  roles: number[];
}
// 调用接口时传入返回数据的结构类型;
function toLogin(): ApiResponse<LoginRes> {
  return {
    code: 0,
    data: {
      token: 'Bear token',
      roles: [1, 2]
    }
  };
}

// 创建实例时提供类型
class MyArray<T> {
  // T => number
  arr: T[] = [];
  add(num: T) {
    this.arr.push(num);
  }
  getMaxNum(): T {
    let arr = this.arr;
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      let current = arr[i];
      current > max ? (max = current) : null;
    }
    return max;
  }
}
let myArr = new MyArray<number>(); // 没有传递类型，默认类型为unknown
myArr.add(3);
myArr.add(1);
myArr.add(2);
console.log(myArr.getMaxNum());
