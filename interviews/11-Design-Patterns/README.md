# 设计模式面试题

## Q1: 观察者模式 vs 发布订阅模式 [P7]

```
观察者模式 (Observer):
Subject ───直接通知───▶ Observer1, Observer2
（耦合：Subject 知道 Observer）

发布订阅 (Pub/Sub):
Publisher ──▶ EventBus ──▶ Subscriber1, Subscriber2
（解耦：Publisher 不知道 Subscriber）
```

```javascript
// 观察者模式
class Subject {
  observers = [];
  subscribe(observer) { this.observers.push(observer); }
  notify(data) { this.observers.forEach(o => o.update(data)); }
}

// 发布订阅（EventEmitter）
class EventBus {
  events = {};
  on(event, fn) { (this.events[event] ||= []).push(fn); }
  emit(event, ...args) { (this.events[event] || []).forEach(fn => fn(...args)); }
}
```

## Q2: 单例模式 [P7]

```javascript
class Singleton {
  static instance = null;
  static getInstance() {
    if (!Singleton.instance) Singleton.instance = new Singleton();
    return Singleton.instance;
  }
  constructor() { if (Singleton.instance) return Singleton.instance; }
}

// ES Module 天然单例
// utils.js
export const store = {
  state: {},
  setState(key, value) { this.state[key] = value; }
};
```

## Q3: 策略模式 [P8]

```javascript
// 表单验证策略
const strategies = {
  required: (value) => value.trim() ? '' : '不能为空',
  minLength: (value, len) => value.length >= len ? '' : `最少${len}个字符`,
  pattern: (value, regex) => regex.test(value) ? '' : '格式不正确',
};

function validate(value, rules) {
  for (const rule of rules) {
    const [name, ...args] = rule.split(':');
    const error = strategies[name](value, ...args);
    if (error) return error;
  }
  return '';
}

validate('', ['required']);           // '不能为空'
validate('ab', ['minLength:3']);      // '最少3个字符'
```

## Q4: 装饰器模式 [P8]

```javascript
// 函数装饰器
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
}

function withRetry(fn, maxRetries = 3) {
  return async function(...args) {
    for (let i = 0; i <= maxRetries; i++) {
      try { return await fn.apply(this, args); }
      catch (e) { if (i === maxRetries) throw e; }
    }
  };
}

// 组合装饰器
const enhancedFetch = withLogging(withRetry(fetch, 3));
```

## Q5: 工厂模式 [P7]

```javascript
// 组件工厂
function createComponent(type, props) {
  const components = {
    button: ButtonComponent,
    input: InputComponent,
    select: SelectComponent,
  };
  const Component = components[type];
  if (!Component) throw new Error(`Unknown type: ${type}`);
  return new Component(props);
}

// React 中的工厂模式
function renderFormField(config) {
  switch (config.type) {
    case 'text': return <Input {...config} />;
    case 'select': return <Select {...config} />;
    case 'date': return <DatePicker {...config} />;
    default: return null;
  }
}
```

## Q6: 代理模式 [P8]

```javascript
// 前端应用：图片懒加载代理
class ImageProxy {
  constructor(src) {
    this.src = src;
    this.loaded = false;
  }

  load() {
    if (this.loaded) return this.img;
    this.img = new Image();
    this.img.src = this.src;
    this.loaded = true;
    return this.img;
  }
}

// Proxy 实现属性访问控制
const readonlyProxy = (obj) => new Proxy(obj, {
  set() { throw new Error('Object is readonly'); }
});
```

## Q7: 前端常用设计模式总结 [P8]

| 模式 | 前端应用场景 |
|------|------------|
| **观察者** | Vue 响应式系统、Redux subscribe |
| **发布订阅** | EventEmitter、自定义事件、组件通信 |
| **单例** | 全局Store、Dialog管理器、WebSocket实例 |
| **策略** | 表单验证、排序算法选择、权限判断 |
| **工厂** | 组件创建、API 适配器 |
| **装饰器** | HOC、函数增强、日志/缓存/重试 |
| **代理** | Proxy 响应式、懒加载、缓存代理 |
| **适配器** | API 数据格式转换、第三方库封装 |
| **组合** | React 组件组合、文件系统树 |
| **迭代器** | for...of、Generator、自定义迭代 |
