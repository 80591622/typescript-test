// 引入reflect-metadata：用于定义/读取元数据（装饰器的核心依赖，需先安装：npm install reflect-metadata）
import 'reflect-metadata';

/**
 * 通用方法装饰器工厂：生成对应HTTP方法（get/post/delete/put）的装饰器，用于标记接口的请求方法和路径
 * @param method - HTTP请求方法（如 "get" "post" "delete" "put"）
 * @returns 路径装饰器工厂函数
 */
function methodDecorator(method: string) {
  // 第一层：接收HTTP方法（get/post/delete/put），返回「路径装饰器工厂」
  return function (path: string) {
    // 第二层：接收接口路径（如 "/detail"），返回「实际的方法装饰器」
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
      // 第三层：实际的方法装饰器（装饰类的方法）
      // 1. 给方法的执行函数挂载元数据：存储HTTP请求方法（如 "get"/"delete"/"put"）
      Reflect.defineMetadata('method', method, descriptor.value);
      // 2. 给方法的执行函数挂载元数据：存储接口路径（如 "/detail"）
      Reflect.defineMetadata('path', path, descriptor.value);
    };
  };
}

/**
 * Controller装饰器工厂：类装饰器，标记控制器的根路径
 * @param path - 控制器根路径（如 "/article"），可选，默认空字符串
 * @returns 类装饰器函数
 */
export const Controller = (path?: string) => {
  return function (target: any) {
    // 给控制器类挂载元数据：存储根路径（若无传入则为空字符串）
    Reflect.defineMetadata('path', path ?? '', target);
  };
};

// 生成具体的HTTP方法装饰器：基于通用methodDecorator，分别生成@Get/@Post装饰器
export const Get = methodDecorator('get'); // Get装饰器：标记GET请求接口
export const Post = methodDecorator('post'); // Post装饰器：标记POST请求接口
export const Delete = methodDecorator('delete'); // 新增：Delete装饰器：标记DELETE请求接口（用于删除资源）
export const Put = methodDecorator('put'); // 新增：Put装饰器：标记PUT请求接口（用于全量更新资源）

/**
 * 文章控制器：通过装饰器标记根路径和接口信息，模拟后端接口控制器
 */
@Controller('/article') // 标记控制器根路径为 "/article"
class ArticleController {
  // 标记该方法为GET请求，接口路径为 "/detail"
  @Get('/detail')
  getDetail() {
    return 'get detail'; // 模拟接口返回值
  }

  // 标记该方法为POST请求，接口路径为 "/add"
  @Post('/add')
  addArticle() {
    return 'post add'; // 模拟接口返回值
  }

  // 新增：标记该方法为DELETE请求，接口路径为 "/delete"
  @Delete('/delete')
  deleteArticle() {
    return 'delete article'; // 模拟接口返回值：删除文章
  }

  // 新增：标记该方法为PUT请求，接口路径为 "/update"
  @Put('/update')
  updateArticle() {
    return 'put update'; // 模拟接口返回值：更新文章
  }
}

/**
 * 路由生成函数：解析控制器实例的元数据，自动生成路由配置表
 * @param instance - 控制器实例（如 new ArticleController()）
 * @returns 路由配置数组：包含完整路径、请求方法、处理函数
 */
function createRoutes(instance: any) {
  // 1. 获取控制器实例的原型对象（包含类的所有方法）
  const prototype = Reflect.getPrototypeOf(instance)!;
  // 2. 从控制器类（原型的构造函数）读取元数据：获取根路径（如 "/article"）
  const rootPath = Reflect.getMetadata('path', prototype.constructor);
  // 3. 获取原型上的所有属性/方法名，过滤掉constructor（只保留业务方法）
  const methods = Reflect.ownKeys(prototype).filter((item) => item !== 'constructor');

  // 4. 遍历所有业务方法，解析每个方法的路由元数据，生成路由配置
  const routes = methods.map((method) => {
    // 获取方法的执行函数（如 getDetail/addArticle/deleteArticle/updateArticle）
    const requestHandler = (prototype as any)[method];
    // 从方法函数读取元数据：获取接口子路径（如 "/detail"/"/delete"/"/update"）
    const requestPath = Reflect.getMetadata('path', requestHandler);
    // 从方法函数读取元数据：获取HTTP请求方法（如 "get"/"delete"/"put"）
    const requestMethod = Reflect.getMetadata('method', requestHandler);

    // 组装完整路由配置
    return {
      requestPath: `${rootPath}${requestPath}`, // 根路径+子路径（如 "/article/detail"/"/article/delete"）
      requestHandler, // 接口处理函数（如 getDetail/deleteArticle）
      requestMethod // HTTP请求方法（如 "get"/"delete"/"put"）
    };
  });

  return routes;
}

// ========== 业务执行：生成路由表 ==========
// 创建文章控制器实例，解析生成路由配置
const routes = createRoutes(new ArticleController());
// 打印路由表：包含GET/POST/DELETE/PUT四种类型的路由配置
console.log(routes);

// 装饰器的核心是「元数据」：通过 Reflect.defineMetadata 存储配置，Reflect.getMetadata 读取配置；
// 装饰器工厂嵌套：methodDecorator 是三层嵌套函数，分别接收「HTTP 方法」「接口路径」「装饰器参数」；
// 路由解析核心：从控制器实例的原型中读取类 / 方法的元数据，组装完整路由信息；
// 设计思想：声明式编程，用装饰器替代硬编码，降低路由配置和业务逻辑的耦合
// [
//   {
//     requestPath: '/article/detail',
//     requestHandler: [Function: getDetail],
//     requestMethod: 'get'
//   },
//   {
//     requestPath: '/article/add',
//     requestHandler: [Function: addArticle],
//     requestMethod: 'post'
//   },
//   {
//     requestPath: '/article/delete',
//     requestHandler: [Function: deleteArticle],
//     requestMethod: 'delete'
//   },
//   {
//     requestPath: '/article/update',
//     requestHandler: [Function: updateArticle],
//     requestMethod: 'put'
//   }
// ]
export {};
