# JavaScript 手写代码题

## W1: 手写 new [P7]

```javascript
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  const result = Ctor.apply(obj, args);
  return result instanceof Object ? result : obj;
}
```

## W2: 手写 call/apply/bind [P7]

```javascript
Function.prototype.myCall = function(ctx = globalThis, ...args) {
  const key = Symbol();
  ctx[key] = this;
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
};

Function.prototype.myBind = function(ctx, ...outer) {
  const fn = this;
  return function bound(...inner) {
    if (new.target) return new fn(...outer, ...inner);
    return fn.apply(ctx, [...outer, ...inner]);
  };
};
```

## W3: 手写防抖 / 节流 [P7]

```javascript
function debounce(fn, delay, immediate = false) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    if (immediate && !timer) fn.apply(this, args);
    timer = setTimeout(() => {
      if (!immediate) fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

function throttle(fn, interval) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

## W4: 手写 Promise.all / race / allSettled [P8]

```javascript
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    const results = [], arr = [...promises];
    let count = 0;
    if (!arr.length) return resolve([]);
    arr.forEach((p, i) => {
      Promise.resolve(p).then(v => {
        results[i] = v;
        if (++count === arr.length) resolve(results);
      }, reject);
    });
  });
};
```

## W5: 手写深拷贝 [P8]

```javascript
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
  if (obj instanceof Map) {
    const m = new Map(); map.set(obj, m);
    obj.forEach((v, k) => m.set(deepClone(k, map), deepClone(v, map)));
    return m;
  }
  if (obj instanceof Set) {
    const s = new Set(); map.set(obj, s);
    obj.forEach(v => s.add(deepClone(v, map)));
    return s;
  }
  const result = Array.isArray(obj) ? [] : {};
  map.set(obj, result);
  Reflect.ownKeys(obj).forEach(k => { result[k] = deepClone(obj[k], map); });
  return result;
}
```

## W6: 手写 EventEmitter [P8]

```javascript
class EventEmitter {
  constructor() { this.events = new Map(); }
  on(e, fn) { (this.events.get(e) || this.events.set(e, []).get(e)).push({ fn, once: false }); return this; }
  once(e, fn) { (this.events.get(e) || this.events.set(e, []).get(e)).push({ fn, once: true }); return this; }
  emit(e, ...args) {
    if (!this.events.has(e)) return false;
    const ls = this.events.get(e), keep = [];
    for (const l of ls) { l.fn.apply(this, args); if (!l.once) keep.push(l); }
    keep.length ? this.events.set(e, keep) : this.events.delete(e);
    return true;
  }
  off(e, fn) {
    if (!fn) { this.events.delete(e); return this; }
    const f = (this.events.get(e) || []).filter(l => l.fn !== fn);
    f.length ? this.events.set(e, f) : this.events.delete(e);
    return this;
  }
}
```

## W7: 手写并发控制器 [P9]

```javascript
class ConcurrencyPool {
  constructor(limit) { this.limit = limit; this.running = 0; this.queue = []; }
  async add(task) {
    if (this.running >= this.limit) await new Promise(r => this.queue.push(r));
    this.running++;
    try { return await task(); }
    finally { this.running--; this.queue.length && this.queue.shift()(); }
  }
}
```

## W8: 手写 LRU Cache [P9]

```javascript
class LRUCache {
  constructor(cap) { this.cap = cap; this.cache = new Map(); }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const v = this.cache.get(key);
    this.cache.delete(key); this.cache.set(key, v);
    return v;
  }
  put(key, val) {
    this.cache.has(key) && this.cache.delete(key);
    this.cache.set(key, val);
    if (this.cache.size > this.cap) this.cache.delete(this.cache.keys().next().value);
  }
}
```

## W9: 手写 Proxy 实现数据校验 [P8]

```javascript
function createValidator(schema) {
  return new Proxy({}, {
    set(target, prop, value) {
      const validator = schema[prop];
      if (validator && !validator(value)) {
        throw new TypeError(`Invalid value for ${prop}: ${value}`);
      }
      target[prop] = value; return true;
    }
  });
}

const user = createValidator({
  age: v => typeof v === 'number' && v > 0 && v < 150,
  name: v => typeof v === 'string' && v.length > 0,
});
user.name = 'Alice'; // ✅
user.age = -1;       // ❌ TypeError
```

## W10: 手写 flatten 数组拍平 [P7]

```javascript
// 递归
function flatten(arr, depth = Infinity) {
  return depth > 0
    ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val), [])
    : arr.slice();
}

// 迭代（栈）
function flattenIterative(arr) {
  const stack = [...arr], result = [];
  while (stack.length) {
    const item = stack.pop();
    Array.isArray(item) ? stack.push(...item) : result.unshift(item);
  }
  return result;
}
```
