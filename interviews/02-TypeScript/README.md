# TypeScript 面试题

## Q1: interface 和 type 的区别？[P7]

| 特性 | interface | type |
|------|-----------|------|
| 扩展方式 | `extends` 关键字 | `&` 交叉类型 |
| 声明合并 | ✅ 支持（同名自动合并） | ❌ 不支持（报错） |
| 支持类型 | 对象/函数 | 对象/基础类型/联合/交叉/元组 |
| 性能 | 更好（缓存更友好） | 处理复杂交叉可能稍慢 |

**选型建议**：
- 定义对象结构、API 契约、支持第三方扩展时，用 `interface`。
- 定义基本类型别名、联合类型、复杂结构映射（如 `Omit` / `Pick`组合）时，用 `type`。

## Q2: never, void, any, unknown 的区别？[P7]

- **any**: 放弃类型检查，可以被赋值给任何类型，也可以被赋任何值。
- **unknown**: 顶级类型。可以被赋任何值，但**不能**赋值给其他类型（any除外），必须先进行类型断言或控制流分析。
- **void**: 函数无返回值时的类型。可以赋值 `undefined`。
- **never**: 底层类型。表示永远不会有值的类型（如死循环、抛出异常的函数返回类型）。常用于**穷尽检查（Exhaustive Check）**。

```typescript
function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}
// switch case 中遗漏分支时，TS 会把 x 的类型推断为特定的联合项，
// 如果传给 assertNever 就会报错，从而强制开发者处理所有情况。
```

## Q3: 什么是协变和逆变？[P8]

- **协变 (Covariant)**：允许子类型转换为父类型。（数组的类型关系默认是协变）
- **逆变 (Contravariant)**：允许父类型转换为子类型。（函数的**参数类型**是逆变）
- **双向协变 (Bivariant)**：旧版 TS 函数参数是双向协变，开启 `strictFunctionTypes: true` 后参数只有逆变。

**逆变例子**：
```typescript
interface Animal {}
interface Dog extends Animal { bark(): void; }

let f1: (x: Animal) => void;
let f2: (x: Dog) => void;

f2 = f1; // ✅ OK (逆变)
// f2 期待一个 Dog，f1 虽然只期待 Animal，但 Dog 包含所有 Animal 的属性，所以安全。

// f1 = f2; // ❌ Error
// f1 期待任何 Animal (如 Cat)，但传给 f2 时 f2 可能会调 dog.bark()，Cat 没有，所以不安全。
```

## Q4: TS 装饰器原理？[P8]

**类装饰器**：
运行时在类定义后立即执行，可以修改类的原型或替换类构造函数。

```typescript
function Log(target: any) {
  console.log('Class defined:', target.name);
}

@Log
class MyClass {}
```

**方法装饰器**：
接收 3 个参数：`target`（类的原型），`propertyKey`（方法名），`descriptor`（属性描述符）。

```typescript
function Readonly(target: any, key: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false;
  return descriptor;
}
```

## Q5: keyof, typeof, in 的用法 [P7]

- **typeof**: 获取变量或函数的类型推断。
- **keyof**: 获取对象类型的所有键，返回联合类型。
- **in**: 在**映射类型**中遍历联合类型。

```typescript
const obj = { a: 1, b: '2' };
type TObj = typeof obj; // { a: number, b: string }
type Keys = keyof TObj; // 'a' | 'b'

type MyPartial<T> = {
  [K in keyof T]?: T[K]
};
```

## Q6: Omit 和 Pick 的底层实现？[P8]

```typescript
// Pick 挑选属性
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Exclude 排除联合类型中的某几项
type MyExclude<T, U> = T extends U ? never : T;

// Omit = Pick + Exclude
// 从 T 中挑选出 "不属于 K" 的键
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```
