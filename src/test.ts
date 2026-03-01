// 命名空间可以用于组织代码，避免文件内命名冲突（内部模块）。想要被外界使用也可以通过 export 导出命名空间
// 命名空间主要是给对象扩展属性，可以做到产生一个作用域
export namespace Zoo {
  export class Dog {
    eat() {
      console.log('zoo dog');
    }
  }
}
export namespace Home {
  export class Dog {
    eat() {
      console.log('home dog');
    }
  }
}
// 命名空间嵌套使用;
export namespace Earth {
  export namespace Contra {
    export class China {}
    export class America {}
  }
}

export namespace Zoo {
  export class Cat {
    eat() {
      console.log('zoo dog');
    }
  }
}
// 同名的命名空间可以自动合并;
export namespace Zoo {
  export class Monkey {
    eat() {
      console.log('zoo monkey');
    }
  }
}
// 命名空间也可用于：扩展类、扩展方法、扩展枚举类型
class A {
  static b = 'hello b';
}
namespace A {
  export let a = 'hello a';
}

function counter(): number {
  return counter.count++;
}
namespace counter {
  export let count = 0;
}

enum ROLE {
  user = 0
}
namespace ROLE {
  export let admin = 1;
}
