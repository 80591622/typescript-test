// 通常字面量类型都和联合类型一起使用
type Direction = 'up' | 'down' | 'left' | 'right';
let direction: Direction = 'up';

// |（联合类型）：「或」的关系，值只需满足其中一个类型，使用前需类型收窄；
// &（交叉类型）：「且」的关系，值需满足所有类型，属性会合并（冲突属性为 never）；
// 核心使用场景：
// 多类型可选 → 用 |；
// 多类型合并 → 用 &。
// 对象类型的互斥
type women =
  | {
      wealthy: true;
      waste: string;
    }
  | {
      wealthy: false;
      morality: string;
    };

let richWoman: women = {
  wealthy: true,
  waste: '不停的购物'
  // morality: '勤俭持家'
};

// 非空断言
let ele: HTMLElement | null = document.getElementById('app');
// console.log(ele?.style.color); // js中的可选链操作符
// console.log(ele!.style.color); // TS中非空断言ele元素一定有值

// 类型断言
let username: string | number = 1;
(username! as number).toFixed(2); // 方式1
(<number>username!).toFixed(2); // 方式2
// username! as boolean; // 错误 类型 "string | number" 到类型 "boolean" 的转换可能是错误的

// 尽量不要使用双重断言，会破坏原有类型关系，断言为 any 是因为 any 类型可以被赋值给其他类型
let firstName: string | boolean;
firstName! as any as string;
