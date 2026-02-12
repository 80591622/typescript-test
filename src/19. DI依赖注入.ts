/**
 * IoC 容器类：增强版（支持装饰器自动注册类 + 自动属性注入）
 * 核心能力：
 * 1. 存储类实例（instances）和属性依赖映射（properties）
 * 2. bind：注册类到容器并创建实例（单例）
 * 3. resolve：解析类实例，并自动注入所有标记的属性依赖
 */
class Container {
  // 存储「唯一标识 -> 类实例」：key是Provide装饰器的key，value是类的实例（单例）
  private instances = new Map();
  // 存储「类名-属性名 -> 依赖标识」：记录需要注入的属性依赖（如 "Computer-monitor" -> "Monitor"）
  public properties = new Map();

  /**
   * 绑定类到容器：创建类实例并缓存（单例）
   * @template T - 类的类型
   * @param key - 类的唯一标识（Provide装饰器传入）
   * @param creator - 类的创建函数（new Target()）
   * @returns 缓存的类实例
   */
  bind<T>(key: string, creator: () => T) {
    if (!this.instances.has(key)) {
      // 单例逻辑：仅首次调用时创建
      this.instances.set(key, creator());
    }
    return this.instances.get(key) as T;
  }

  /**
   * 解析类实例，并自动注入所有标记的属性依赖
   * @template T - 类的类型
   * @param key - 类的唯一标识（Provide装饰器传入）
   * @returns 完成依赖注入的类实例
   */
  resolve<T>(key: string): T {
    // 1. 从容器中获取原始实例（未注入属性依赖）
    let instance = this.instances.get(key);
    if (!instance) return instance as T; // 实例不存在则直接返回

    // 2. 遍历所有属性依赖配置，为当前实例注入依赖
    for (let property of this.properties) {
      // property 结构：[key: "类名-属性名", value: 依赖标识]
      let [propConfigKey, ServiceKey] = property;
      // 拆分出「类名」和「属性名」（如 "Computer-monitor" -> ["Computer", "monitor"]）
      let [classKey, propKey] = propConfigKey.split('-');

      // 过滤：仅处理当前实例所属类的属性依赖
      if (instance.constructor.name !== classKey) {
        continue;
      }

      // 3. 递归解析依赖实例（如解析 "Monitor" 得到 Monitor27inch 实例）
      const target = this.resolve(ServiceKey);
      // 4. 为当前实例的属性赋值（注入依赖）
      instance[propKey] = target;
    }

    return instance as T;
  }
}

// 创建全局IoC容器实例：所有类的注册和依赖注入都基于此容器
const container = new Container();

// ========== 装饰器定义：实现类的自动注册和属性依赖标记 ==========
/**
 * Provide装饰器：类装饰器，将类自动注册到IoC容器
 * @param key - 类在容器中的唯一标识（如 "Monitor" "Computer"）
 * @returns 类装饰器函数
 */
function Provide(key: string) {
  return function (Target: any) {
    // 调用容器bind方法：注册类到容器（key优先用传入值，否则用类名）
    container.bind(key ?? Target.name, () => new Target());
  };
}

/**
 * Inject装饰器：属性装饰器，标记属性需要从容器中注入依赖
 * @param InjectKey - 依赖在容器中的唯一标识（对应Provide的key）
 * @returns 属性装饰器函数
 */
function Inject(InjectKey: string) {
  return function (target: any, key: string) {
    // 存储属性依赖映射：key = 类名-属性名，value = 依赖标识
    // target.constructor.name：获取属性所属类的名字（如 Computer）
    container.properties.set(`${target.constructor.name}-${key}`, InjectKey);
  };
}

// ========== 业务类定义：使用装饰器标记注册和依赖 ==========
/** 27英寸显示器类：通过Provide注册到容器，标识为"Monitor" */
@Provide('Monitor')
class Monitor27inch {}

/** 苹果主机类：通过Provide注册到容器，标识为"Host" */
@Provide('Host')
class AppleHost {}

/** 电脑类：通过Provide注册到容器，标识为"Computer" */
@Provide('Computer')
class Computer {
  // 标记monitor属性：从容器注入"Monitor"标识对应的实例（Monitor27inch）
  @Inject('Monitor')
  monitor!: Monitor27inch;

  // 标记host属性：从容器注入"Host"标识对应的实例（AppleHost）
  @Inject('Host')
  host!: AppleHost;

  /** 电脑启动方法：依赖已由容器自动注入，可直接使用 */
  bootstrap() {
    console.log('启动电脑');
    console.log('当前显示器：', this.monitor); // 输出 Monitor27inch 实例
    console.log('当前主机：', this.host); // 输出 AppleHost 实例
  }
}

// ========== 业务调用：从容器解析实例，自动完成依赖注入 ==========
// 解析Computer实例：容器自动注入monitor和host属性
const computer = container.resolve<Computer>('Computer');
computer.bootstrap(); // 输出：启动电脑

// Provide装饰器负责注册类到容器，Inject装饰器负责标记属性依赖；
// 容器resolve方法是核心：解析实例时自动遍历属性依赖映射，递归注入所有依赖；
// 整个流程实现了 “声明式” 依赖注入：仅需装饰器标记，无需手动管理依赖创建和传递；
// 核心数据结构：instances存实例（单例），properties存属性依赖映射
export {};
