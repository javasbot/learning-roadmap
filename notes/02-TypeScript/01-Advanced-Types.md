# TypeScript 高级类型系统

> **权威来源**：[TypeScript Handbook - Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

## 一、条件类型（Conditional Types）

### 1.1 基本语法

```typescript
// T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
```

### 1.2 分布式条件类型（Distributive Conditional Types）

当条件类型作用于联合类型时，会自动分发：

```typescript
type ToArray<T> = T extends any ? T[] : never;

// 分布式行为：
type Result = ToArray<string | number>;
// = ToArray<string> | ToArray<number>
// = string[] | number[]
// 注意：不是 (string | number)[]

// 阻止分布式行为：用元组包裹
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type Result2 = ToArrayNonDist<string | number>;
// = (string | number)[]
```

### 1.3 infer 关键字

`infer` 在条件类型中声明一个待推断的类型变量：

```typescript
// 提取函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = () => string;
type R = ReturnType<Fn>;  // string

// 提取 Promise 内部类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type P = UnwrapPromise<Promise<number>>;  // number

// 提取数组元素类型
type ElementOf<T> = T extends (infer E)[] ? E : never;

type E = ElementOf<string[]>;  // string

// 提取函数第一个参数类型
type FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never;

type F = FirstArg<(name: string, age: number) => void>;  // string
```

### 1.4 嵌套条件类型

```typescript
// 深层解包 Promise
type DeepUnwrap<T> = T extends Promise<infer U>
  ? DeepUnwrap<U>  // 递归解包
  : T;

type D = DeepUnwrap<Promise<Promise<Promise<number>>>>;  // number
```

## 二、映射类型（Mapped Types）

### 2.1 基本映射

```typescript
// 将所有属性变为可选
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// 将所有属性变为只读
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// 将所有属性变为必选
type MyRequired<T> = {
  [K in keyof T]-?: T[K];  // -? 移除可选修饰符
};
```

### 2.2 键重映射（Key Remapping via `as`）

```typescript
// 给所有属性名加前缀
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${Capitalize<string & K>}`]: T[K];
};

interface User {
  name: string;
  age: number;
}

type PrefixedUser = Prefixed<User, 'get'>;
// { getName: string; getAge: number }

// 过滤特定类型的属性
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type StringProps = OnlyStrings<User>;
// { name: string }  — age 被过滤掉
```

### 2.3 内置工具类型实现

```typescript
// Pick
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

// Record
type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};

// Exclude (联合类型过滤)
type MyExclude<T, U> = T extends U ? never : T;

type E = MyExclude<'a' | 'b' | 'c', 'a'>;  // 'b' | 'c'

// Extract (联合类型提取)
type MyExtract<T, U> = T extends U ? T : never;
```

## 三、模板字面量类型（Template Literal Types）

```typescript
// 基本用法
type EventName = `on${Capitalize<'click' | 'focus' | 'blur'>}`;
// 'onClick' | 'onFocus' | 'onBlur'

// 内置字符串操作类型
type Upper = Uppercase<'hello'>;       // 'HELLO'
type Lower = Lowercase<'HELLO'>;       // 'hello'
type Cap = Capitalize<'hello'>;        // 'Hello'
type Uncap = Uncapitalize<'Hello'>;    // 'hello'

// CSS 属性类型安全
type CSSValue = `${number}${'px' | 'em' | 'rem' | '%'}`;
const width: CSSValue = '100px';      // ✅
// const bad: CSSValue = '100vw';     // ❌

// 路由路径参数提取
type ExtractParams<T extends string> = 
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<Rest>
    : T extends `${string}:${infer Param}`
      ? Param
      : never;

type Params = ExtractParams<'/users/:id/posts/:postId'>;
// 'id' | 'postId'
```

## 四、类型守卫（Type Guards）

```typescript
// 自定义类型谓词
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// 可辨别联合类型 (Discriminated Unions)
type Shape = 
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;  // TS 知道这里是 circle
    case 'rectangle':
      return shape.width * shape.height;    // TS 知道这里是 rectangle
    case 'triangle':
      return 0.5 * shape.base * shape.height;
  }
}

// exhaustive check（穷举检查）
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

function area2(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
    case 'triangle': return 0.5 * shape.base * shape.height;
    default: return assertNever(shape); // 如果遗漏case，编译报错
  }
}
```

## 五、协变与逆变

```typescript
// 协变 (Covariant): 子类型关系保持方向
// Dog extends Animal → Array<Dog> extends Array<Animal> ✅

// 逆变 (Contravariant): 子类型关系反转
// Dog extends Animal → ((a: Animal) => void) extends ((d: Dog) => void) ✅
// 函数参数位置是逆变的

interface Animal { name: string }
interface Dog extends Animal { breed: string }

// 协变示例
type Co<T> = () => T;
type A1 = Co<Dog> extends Co<Animal> ? true : false;  // true

// 逆变示例 (strictFunctionTypes: true)
type Contra<T> = (arg: T) => void;
type A2 = Contra<Animal> extends Contra<Dog> ? true : false;  // true

// 不变 (Invariant)
type In<T> = (arg: T) => T;
type A3 = In<Dog> extends In<Animal> ? true : false;  // false
```

## 六、实用高级模式

### 6.1 Builder 模式类型安全

```typescript
class QueryBuilder<T extends Record<string, any> = {}> {
  private conditions: T = {} as T;
  
  where<K extends string, V>(
    key: K,
    value: V
  ): QueryBuilder<T & Record<K, V>> {
    (this.conditions as any)[key] = value;
    return this as any;
  }
  
  build(): T {
    return this.conditions;
  }
}

const query = new QueryBuilder()
  .where('name', 'John')
  .where('age', 30)
  .build();
// query 类型为 { name: string; age: number }
```

### 6.2 类型安全的事件系统

```typescript
type EventMap = {
  click: { x: number; y: number };
  keydown: { key: string; code: string };
  resize: { width: number; height: number };
};

class TypedEventEmitter<Events extends Record<string, any>> {
  private handlers = new Map<string, Function[]>();

  on<E extends keyof Events>(
    event: E,
    handler: (payload: Events[E]) => void
  ): void {
    const list = this.handlers.get(event as string) || [];
    list.push(handler);
    this.handlers.set(event as string, list);
  }

  emit<E extends keyof Events>(event: E, payload: Events[E]): void {
    this.handlers.get(event as string)?.forEach(h => h(payload));
  }
}

const emitter = new TypedEventEmitter<EventMap>();
emitter.on('click', (e) => {
  console.log(e.x, e.y);  // ✅ 类型安全
});
// emitter.on('click', (e) => e.key);  // ❌ 编译错误
```

## 七、面试高频题

### Q1: `type` 和 `interface` 的区别？什么时候用哪个？
**答**：`interface` 支持声明合并和 `extends`，适合定义对象结构和API契约；`type` 支持联合类型、交叉类型、条件类型等高级特性，适合复杂的类型运算。在定义组件 Props 时推荐 `interface`，在做类型工具时推荐 `type`。

### Q2: 如何实现 DeepPartial？
```typescript
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
```

### Q3: 如何实现类型安全的 `get` 函数（如 lodash.get）？
```typescript
type Get<T, K extends string> =
  K extends `${infer F}.${infer R}`
    ? F extends keyof T
      ? Get<T[F], R>
      : never
    : K extends keyof T
      ? T[K]
      : never;

function get<T, K extends string>(obj: T, path: K): Get<T, K> {
  return path.split('.').reduce((o: any, k) => o?.[k], obj);
}
```
