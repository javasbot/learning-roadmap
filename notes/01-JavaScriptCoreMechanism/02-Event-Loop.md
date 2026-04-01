# 事件循环（Event Loop）深度解析

> **权威来源**：[HTML 规范 - Event Loop](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)、[Node.js 官方文档](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## 一、浏览器事件循环

### 1.1 核心架构

```
┌──────────────────────────────────────────────┐
│                  Call Stack                   │  ← 同步代码执行
│              (执行上下文栈)                    │
└────────────────────┬─────────────────────────┘
                     │
                     ▼ 每轮循环
┌──────────────────────────────────────────────┐
│            Microtask Queue                    │  ← 微任务队列（优先）
│  Promise.then / MutationObserver /            │
│  queueMicrotask                               │
└────────────────────┬─────────────────────────┘
                     │ 微任务全部清空后
                     ▼
┌──────────────────────────────────────────────┐
│             Rendering Steps                   │  ← 渲染步骤（可能跳过）
│  requestAnimationFrame → Style → Layout →     │
│  Paint → Composite                            │
└────────────────────┬─────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│            Macrotask Queue                    │  ← 宏任务队列（取1个）
│  setTimeout / setInterval / I/O /             │
│  MessageChannel / postMessage                 │
└──────────────────────────────────────────────┘
```

### 1.2 严格执行顺序

根据 HTML 规范，一轮事件循环的执行步骤：

1. **选择一个宏任务**（从最老的开始）并执行
2. **检查微任务队列**，依次执行所有微任务（包括执行过程中新产生的微任务）
3. **判断是否需要渲染**（通常 60fps = 每 16.67ms 一次）
4. 如果需要渲染：
   - 执行 `requestAnimationFrame` 回调
   - 执行 Style/Layout/Paint
5. 如果空闲：执行 `requestIdleCallback`
6. 回到步骤 1

### 1.3 微任务 vs 宏任务

| 类型 | API | 执行时机 |
|------|-----|---------|
| **微任务** | `Promise.then/catch/finally` | 当前宏任务结束后立即执行 |
| **微任务** | `queueMicrotask()` | 同上 |
| **微任务** | `MutationObserver` | 同上 |
| **宏任务** | `setTimeout/setInterval` | 下一轮事件循环 |
| **宏任务** | `MessageChannel` | 下一轮事件循环 |
| **宏任务** | `I/O 操作` | 对应回调入队时 |
| **宏任务** | `UI 渲染` | 浏览器判断需要渲染时 |
| **特殊** | `requestAnimationFrame` | 渲染阶段之前 |
| **特殊** | `requestIdleCallback` | 空闲时间 |

### 1.4 经典面试题解析

```javascript
console.log('1');  // 同步

setTimeout(() => {
  console.log('2');  // 宏任务
  Promise.resolve().then(() => {
    console.log('3');  // 微任务
  });
}, 0);

Promise.resolve().then(() => {
  console.log('4');  // 微任务
  setTimeout(() => {
    console.log('5');  // 宏任务
  }, 0);
});

console.log('6');  // 同步

// 输出顺序: 1 → 6 → 4 → 2 → 3 → 5
```

**执行分析**：
```
第1轮:
  同步执行: console.log('1') → console.log('6')
  微任务队列: [() => log('4') + setTimeout]
  宏任务队列: [() => log('2') + Promise]

  清空微任务:
    执行 log('4'), 将 setTimeout(log('5')) 加入宏任务队列
    宏任务队列: [() => log('2') + Promise, () => log('5')]

第2轮:
  取宏任务: log('2'), 将 Promise.then(log('3')) 加入微任务队列
  清空微任务: log('3')

第3轮:
  取宏任务: log('5')
```

### 1.5 async/await 的事件循环行为

```javascript
async function async1() {
  console.log('async1 start');     // 同步
  await async2();                   // 等价于 Promise.resolve(async2()).then(...)
  console.log('async1 end');       // 微任务
}

async function async2() {
  console.log('async2');           // 同步
}

console.log('script start');       // 同步

setTimeout(() => {
  console.log('setTimeout');       // 宏任务
}, 0);

async1();

new Promise((resolve) => {
  console.log('promise1');         // 同步（executor 立即执行）
  resolve();
}).then(() => {
  console.log('promise2');         // 微任务
});

console.log('script end');         // 同步

// 输出:
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```

**关键理解**：`await` 之后的代码等价于 `.then()` 回调，是微任务。

## 二、Node.js 事件循环

### 2.1 Node.js Event Loop 阶段

Node.js 事件循环基于 libuv，分为 6 个阶段：

```
   ┌───────────────────────────┐
┌─▶│         timers            │  ← setTimeout / setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │     pending callbacks     │  ← 系统级回调（TCP错误等）
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │       idle, prepare       │  ← 内部使用
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │          poll              │  ← I/O 回调、新连接
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │         check             │  ← setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │    close callbacks        │  ← socket.on('close')
│  └─────────────┬─────────────┘
│                │
└────────────────┘
```

### 2.2 Node.js 微任务优先级

```
每个阶段之间，Node.js 会清空微任务队列：

process.nextTick 队列 > Promise 微任务队列 > 当前阶段宏任务
```

```javascript
// Node.js 中 process.nextTick vs Promise
process.nextTick(() => console.log('nextTick 1'));
Promise.resolve().then(() => console.log('promise 1'));
process.nextTick(() => console.log('nextTick 2'));
Promise.resolve().then(() => console.log('promise 2'));

// 输出:
// nextTick 1
// nextTick 2
// promise 1
// promise 2
// (nextTick 队列优先于 Promise 微任务!)
```

### 2.3 setImmediate vs setTimeout

```javascript
// 在主模块中，执行顺序不确定
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
// 可能输出 timeout → immediate 或 immediate → timeout

// 在 I/O 回调中，setImmediate 总是先执行
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});
// 输出: immediate → timeout (确定的)
```

**原因**：I/O 回调在 poll 阶段执行，poll 之后是 check 阶段（setImmediate），然后是下一轮的 timers 阶段（setTimeout）。

## 三、浏览器 vs Node.js 事件循环差异

| 特性 | 浏览器 | Node.js |
|------|--------|---------|
| 微任务执行时机 | 每个宏任务后清空 | 每个阶段转换时清空 |
| `process.nextTick` | 不存在 | 最高优先级微任务 |
| `setImmediate` | 不存在 | check 阶段执行 |
| `requestAnimationFrame` | 渲染前执行 | 不存在 |
| `requestIdleCallback` | 空闲时执行 | 不存在 |
| I/O 处理 | 浏览器 API | libuv 线程池 |

## 四、微任务饥饿问题

```javascript
// ⚠️ 微任务饥饿：无限产生微任务会阻塞渲染和宏任务
function microTaskHell() {
  Promise.resolve().then(() => {
    console.log('micro');
    microTaskHell();  // 递归产生微任务
  });
}

microTaskHell();
// 页面将完全卡死！宏任务和渲染永远没有机会执行
```

**解决方案**：使用 `setTimeout` 或 `requestAnimationFrame` 让出主线程。

## 五、面试高频题

### Q1: 为什么 Vue 的 `nextTick` 使用微任务？
**答**：因为微任务在 DOM 更新后、渲染前执行，可以在一个事件循环内批量收集数据变化，一次性更新 DOM，然后在微任务中获取更新后的 DOM 状态，避免触发额外的渲染。

### Q2: requestAnimationFrame 是宏任务还是微任务？
**答**：都不是。rAF 在渲染阶段之前执行，有独立的执行时机。它在微任务清空之后、渲染步骤之前被调用。

### Q3: 如何实现一个不阻塞页面的大量计算？
**答**：三种方案：
1. **Web Worker**：将计算移到工作线程
2. **时间切片**：将计算分割为小块，用 `requestIdleCallback` 或 `setTimeout` 分帧执行
3. **WASM**：对计算密集型使用 WebAssembly

```javascript
// 时间切片示例
function processChunk(items, index, chunkSize, callback) {
  const end = Math.min(index + chunkSize, items.length);
  for (let i = index; i < end; i++) {
    // 处理单个item
  }
  if (end < items.length) {
    requestIdleCallback(() => processChunk(items, end, chunkSize, callback));
  } else {
    callback();
  }
}
```
