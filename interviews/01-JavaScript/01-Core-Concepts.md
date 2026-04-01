# JavaScript 核心概念面试题

## Q1: var/let/const 区别 [P7]

| 特性 | var | let | const |
|------|-----|-----|-------|
| 作用域 | 函数 | 块 | 块 |
| 变量提升 | ✅ (undefined) | ✅ (TDZ) | ✅ (TDZ) |
| 重复声明 | ✅ | ❌ | ❌ |
| 重新赋值 | ✅ | ✅ | ❌ |

```javascript
console.log(a); // undefined
console.log(b); // ReferenceError (TDZ)
var a = 1;
let b = 2;
```

## Q2: 原型链 [P7]

```javascript
function Person(name) { this.name = name; }
const p = new Person('Alice');

// 原型链: p → Person.prototype → Object.prototype → null
// p.__proto__ === Person.prototype  ✅
// Function.__proto__ === Function.prototype  ✅
// Object.__proto__ === Function.prototype  ✅
```

## Q3: this 指向规则（优先级从高到低）[P7]

1. **new**: `new Fn()` → this = 新对象
2. **显式**: `call/apply/bind` → this = 指定对象
3. **隐式**: `obj.fn()` → this = obj
4. **默认**: `fn()` → this = window（严格模式undefined）
5. **箭头函数**: 继承外层this（不可改变）

```javascript
const obj = {
  name: 'obj',
  fn() { console.log(this.name); },
  arrow: () => { console.log(this.name); }
};
obj.fn();    // 'obj'
obj.arrow(); // undefined (箭头函数的this = 外层window)
const fn = obj.fn;
fn();        // undefined (默认绑定)
```

## Q4: 闭包的本质 [P8]

闭包 = 函数 + 其词法环境的引用。

```javascript
// 模块模式
const counter = (function() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count,
  };
})();

// 柯里化
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3); // 6
add(1, 2)(3); // 6
```

## Q5: 类型判断 [P7]

```javascript
// typeof: 基本类型 (null除外)
typeof 42;          // 'number'
typeof null;        // 'object' (历史bug)
typeof undefined;   // 'undefined'
typeof [];          // 'object'

// instanceof: 原型链判断
[] instanceof Array;  // true
[] instanceof Object; // true

// Object.prototype.toString (最准确)
Object.prototype.toString.call([]);     // '[object Array]'
Object.prototype.toString.call(null);   // '[object Null]'
Object.prototype.toString.call(/a/);    // '[object RegExp]'

// Array.isArray (数组专用)
Array.isArray([]);  // true
```

## Q6: == 和 === 的区别 [P7]

```javascript
// == 会进行类型转换
'' == false;    // true (都转为0)
null == undefined; // true (特殊规则)
null == 0;      // false (null只和undefined相等)
NaN == NaN;     // false (NaN不等于任何值)

// === 严格相等，不转换
'' === false;   // false
null === undefined; // false
```

## Q7: 事件委托 [P7]

```javascript
// 利用事件冒泡，在父元素上统一处理
document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log(e.target.textContent);
  }
});
// 优点：减少监听器数量、动态元素自动支持
```

## Q8: ES6+ 核心特性 [P8]

```javascript
// 解构赋值
const { a, b: renamed, c = 'default' } = obj;

// 可选链 + 空值合并
const name = user?.profile?.name ?? 'Anonymous';

// Proxy
const handler = {
  get(target, key) { return key in target ? target[key] : 'default'; },
  set(target, key, value) { 
    if (typeof value !== 'string') throw new TypeError();
    target[key] = value; return true;
  }
};

// WeakMap/WeakSet — 弱引用，不阻止GC
const wm = new WeakMap();
let obj = {};
wm.set(obj, 'data');
obj = null; // wm中的entry可被GC

// Iterator/Generator
function* range(start, end) {
  for (let i = start; i < end; i++) yield i;
}
for (const n of range(0, 5)) console.log(n); // 0,1,2,3,4
```

## Q9: 浅比较 vs 深比较 [P8]

```javascript
// React.memo / PureComponent 使用浅比较
function shallowEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a === null || b === null) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => 
    Object.prototype.hasOwnProperty.call(b, key) && Object.is(a[key], b[key])
  );
}
```

## Q10: Symbol 的用途 [P8]

```javascript
// 1. 唯一属性键（避免冲突）
const id = Symbol('id');
const obj = { [id]: 123 };

// 2. 内置Symbol（定义对象行为）
class MyArray {
  [Symbol.iterator]() {
    let i = 0;
    return { next: () => ({ value: this[i], done: i++ >= this.length }) };
  }
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.length;
    return '[MyArray]';
  }
}

// 3. Symbol.for — 全局共享Symbol
Symbol.for('key') === Symbol.for('key'); // true
```
