// 控制反转 、 依赖注入

// 什么是控制正转， 控制权是交给自己的，自己来处理整个流程
// 什么是反转， 我失去了控制权，全部在内部自己来做的

// ioc 将所有的创建过程全部交给"容器"来做， 可以解决类之间的耦合问题

// ========== 1. 定义抽象接口：实现依赖抽象而非具体实现，降低耦合 ==========
/** 显示器抽象接口：定义显示器的通用规范 */
interface Monitor {}
/** 主机抽象接口：定义主机的通用规范 */
interface Host {}

// ========== 2. 实现具体类：遵循抽象接口，可灵活替换 ==========
/** 27英寸显示器：实现 Monitor 接口 */
class Monitor27inch implements Monitor {}
/** 苹果主机：实现 Host 接口 */
class AppleHost implements Host {}

/** 电脑类：依赖 Monitor 和 Host 抽象接口（而非具体类），通过构造函数接收依赖 */
class Computer {
  // 构造函数注入：依赖由外部传入，而非内部自行创建（控制反转核心）
  constructor(
    public monitor: Monitor, // 显示器依赖
    public host: Host // 主机依赖
  ) {}

  /** 电脑启动方法 */
  bootstrap() {
    console.log('启动电脑');
  }
}

// ========== 3. 实现简易 IoC 容器：统一管理对象创建和依赖注入 ==========
/**
 * IoC 容器类：负责注册/解析对象、管理依赖、控制对象创建权
 * 核心作用：将对象的创建逻辑从业务代码中抽离，实现控制反转
 */
class Container {
  // 存储已创建的实例（键：唯一标识，值：实例对象）
  private instances = new Map();

  /**
   * 绑定对象到容器：若对象未创建则执行创建函数，返回已创建的实例
   * @template T - 实例类型
   * @param key - 实例的唯一标识
   * @param creator - 创建实例的函数（封装实例化逻辑）
   * @returns 已创建的实例
   */
  bind<T>(key: string, creator: () => T) {
    // 单例逻辑：若实例已存在，直接返回；否则创建并存储
    if (!this.instances.has(key)) {
      this.instances.set(key, creator());
    }
    return this.instances.get(key) as T;
  }

  /**
   * 从容器中解析已绑定的实例
   * @template T - 实例类型
   * @param key - 实例的唯一标识
   * @returns 已存储的实例
   */
  resolve<T>(key: string): T {
    return this.instances.get(key) as T;
  }
}

// ========== 4. 业务使用：通过 IoC 容器管理依赖，实现控制反转 ==========
// 创建 IoC 容器实例
const container = new Container();

// 1. 绑定 Monitor 实例到容器：指定创建逻辑（27英寸显示器）
container.bind<Monitor>('Monitor', () => new Monitor27inch());
// 2. 绑定 Host 实例到容器：指定创建逻辑（苹果主机）
container.bind<Host>('Host', () => new AppleHost());

// 3. 绑定 Computer 实例到容器：从容器解析依赖并注入
const computer = container.bind<Computer>(
  'Computer',
  () =>
    new Computer(
      container.resolve('Monitor'), // 从容器获取显示器依赖
      container.resolve('Host') // 从容器获取主机依赖
    )
);

// 4. 调用电脑方法：依赖已由容器注入，业务代码无需关心依赖创建
computer.bootstrap(); // 输出：启动电脑

// IoC 容器核心：bind 方法注册对象（封装创建逻辑），resolve 方法解析实例，统一管理对象生命周期；
// 依赖注入体现：Computer 的依赖由容器注入，而非自身创建，实现 “依赖抽象、注入具体”；
// 解耦价值：业务代码（Computer）只关注核心逻辑，依赖的创建 / 替换由容器管理，降低类之间的耦合度

export {};
