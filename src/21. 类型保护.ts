// TypeScript 类型保护的本质是：在特定代码块中，通过特定语法 / 逻辑让 TS 编译器精准推断变量的具体类型，避免手动类型断言（as），提升代码安全性和可读性
// 类型保护， 通过判断，去识别类型 ， 核心就是进行类型的收窄
// js 手段来判断类型 typeof | instanceof | in  都有收窄类型的功能 ，通过条件来进行判断
// ts 来判断（可辨识联合类型）自定义类型保护（自己决定返回true的时候是什么类型） null保护（判断非空后再去使用
// 除了我们上述提供的这些，只要能通过结构来判断的 都能达到类型保护的特性

// typeof类型保护
function double(val: number | string) {
  if (typeof val === 'number') {
    val.toFixed();
  } else {
    val.charAt(0);
  }
}

// instanceof类型保护
class Cat {}
class Dog {}

const getInstance = (clazz: { new (): Cat | Dog }) => {
  return new clazz();
};
let r = getInstance(Cat);
if (r instanceof Cat) {
  r;
} else {
  r;
}

// in类型保护;
interface Fish {
  swiming: string;
}
interface Bird {
  fly: string;
  leg: number;
}
function getType(animal: Fish | Bird) {
  if ('swiming' in animal) {
    animal; // Fish
  } else {
    animal; // Bird
  }
}

// 可辨识联合类型;
interface WarningButton {
  class: 'warning';
}
interface DangerButton {
  class: 'danger';
}
function createButton(button: WarningButton | DangerButton) {
  if (button.class == 'warning') {
    button; // WarningButton
  } else {
    button; // DangerButton
  }
}
// -----------类型中有独一无二的特性---------------
function ensureArray<T>(input: T | T[]): T[] {
  return Array.isArray(input) ? input : [input];
}

// null类型保护
const addPrefix = (num?: number) => {
  num = num || 1.1;
  function prefix(fix: string) {
    // 注意 ts 无法检测内部函数变量类型
    return fix + num?.toFixed();
  }
  return prefix('$');
};
console.log(addPrefix());

// 自定义类型保护
interface Fish {
  swiming: string;
}
interface Bird {
  fly: string;
  leg: number;
}
function isBird(animal: Fish | Bird): animal is Bird {
  return 'fly' in animal;
}
function getAniaml(animal: Fish | Bird) {
  if (isBird(animal)) {
    animal;
  } else {
    animal;
  }
}

export {};
