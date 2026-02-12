import 'reflect-metadata';
// class Animal {
//   static type = '哺乳类';
//   eat() {}
// }
// Reflect.defineMetadata('Class', 'Animal metadata', Animal);
// Reflect.defineMetadata('Class property', 'type metadata', Animal, 'type');
// Reflect.defineMetadata('proto method', 'eat metadata', Animal.prototype, 'eat');
/*
 => 
WeakMap => {
            Animal:{
                undefined:{'Class' => 'Animal metadata'},
                type:{'Class property' => 'type metadata'}
            },
            Animal.prototype:{
                eat:{'proto method' => 'eat metadata'},
            }
          }
*/
// 取data
// console.log(Reflect.getMetadata('Class', Animal));
// console.log(Reflect.getMetadata('Class property', Animal, 'type'));
// console.log(Reflect.getMetadata('proto method', Animal.prototype, 'eat'));

// 取key
// console.log(Reflect.getMetadataKeys(Animal));
// console.log(Reflect.getMetadataKeys(Animal, 'type'));
// console.log(Reflect.getMetadataKeys(Animal.prototype, 'eat'));

@Reflect.metadata('Class', 'Animal metadata')
class Animal2 {
  @Reflect.metadata('Class property', 'type metadata')
  static type = '哺乳类';
  @Reflect.metadata('proto method', 'eat metadata')
  eat() {}
}

// 通过原型
// 开启"emitDecoratorMetadata": true后自动生成基于类型的元数据
console.log(Reflect.getMetadata('design:type', Animal2.prototype, 'eat'));
console.log(Reflect.getMetadata('design:paramtypes', Animal2.prototype, 'eat'));
console.log(Reflect.getMetadata('design:returntype', Animal2.prototype, 'eat'));

// 通过实例
console.log(Reflect.getMetadata('design:type', new Animal2(), 'eat'));
console.log(Reflect.getMetadata('design:paramtypes', new Animal2(), 'eat'));
console.log(Reflect.getMetadata('design:returntype', new Animal2(), 'eat'));
2;

export {};
