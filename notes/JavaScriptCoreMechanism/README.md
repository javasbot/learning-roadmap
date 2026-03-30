

# JavaScript 事件循环（Event Loop）权威解析

---

## 一、权威标准文档

| 来源 | 链接 | 说明 |
|------|------|------|
| **WHATWG HTML Standard** | [html.spec.whatwg.org - Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops) | **最权威**，事件循环的定义出处 |
| **WHATWG HTML Standard** | [html.spec.whatwg.org - Processing model](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model) | 事件循环**处理模型**的具体步骤 |
| **ECMAScript Spec (TC39)** | [tc39.es/ecma262 - Jobs and Host Operations](https://tc39.es/ecma262/#sec-jobs) | Promise 微任务（Jobs）的规范定义 |
| **Node.js 官方文档** | [nodejs.org - Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick) | Node.js 环境下的事件循环实现 |
| **MDN Web Docs** | [developer.mozilla.org - Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop) | 最佳学习参考 |

> ⚠️ **关键认知**：事件循环**不是** ECMAScript 语言规范定义的，而是由 **宿主环境**（浏览器 → WHATWG HTML Spec，Node.js → libuv）定义的。

---

## 二、核心机制解析

### 2.1 事件循环处理模型（简化自 WHATWG 规范）

```
┌─────────────────────────────────────────────────────────┐
│                      Event Loop                         │
│                                                         │
│  ┌─────────────┐                                        │
│  │             │    每轮循环（iteration）:               │
│  │  Call Stack │    ┌──────────────────────────────┐     │
│  │  (执行栈)   │    │ 1. 从 Task Queue 取一个任务   │     │
│  │             │    │    放入 Call Stack 执行       │     │
│  └──────┬──────┘    │                              │     │
│         │           │ 2. 执行完毕后，清空所有       │     │
│         ▼           │    Microtask Queue           │     │
│  ┌──────────────┐   │    (循环执行直到队列为空)     │     │
│  │  Microtask   │   │                              │     │
│  │  Queue       │   │ 3. 判断是否需要渲染(Render)   │     │
│  │  (微任务队列) │   │    - requestAnimationFrame   │     │
│  └──────────────┘   │    - Style/Layout/Paint      │     │
│                     │                              │     │
│  ┌──────────────┐   │ 4. 回到步骤 1                │     │
│  │  Task Queue  │   └──────────────────────────────┘     │
│  │  (宏任务队列) │                                       │
│  └──────────────┘                                        │
└─────────────────────────────────────────────────────────┘
```

### 2.2 宏任务 vs 微任务

```
┌──────────────────────────┬──────────────────────────────┐
│      Macrotask (宏任务)   │      Microtask (微任务)       │
├──────────────────────────┼──────────────────────────────┤
│  script (整体代码)        │  Promise.then / catch / finally│
│  setTimeout              │  queueMicrotask              │
│  setInterval             │  MutationObserver (浏览器)    │
│  setImmediate (Node)     │  process.nextTick (Node)     │
│  I/O callbacks           │                              │
│  UI rendering (浏览器)    │                              │
│  MessageChannel          │                              │
│  requestAnimationFrame   │                              │
└──────────────────────────┴──────────────────────────────┘
```

### 2.3 核心规则总结

```
规则 1: 同步代码在当前宏任务中立即执行
规则 2: 每个宏任务执行完后，立即清空所有微任务
规则 3: 微任务执行过程中产生的新微任务，也在本轮清空
规则 4: 清空微任务后，才执行下一个宏任务
规则 5: async/await 是 Promise 的语法糖，await 后面的代码等价于 .then() 回调
```

---

## 三、10 个代码示例（由浅入深）

### 示例 1：同步 vs setTimeout vs Promise（基础三角关系）

```javascript
console.log('1 - sync start');

setTimeout(() => {
  console.log('2 - setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('3 - promise');
});

console.log('4 - sync end');

/*
 * 输出顺序:
 * 1 - sync start       ← 同步，立即执行
 * 4 - sync end         ← 同步，立即执行
 * 3 - promise          ← 微任务，当前宏任务结束后立即执行
 * 2 - setTimeout       ← 宏任务，等下一轮事件循环
 *
 * 解析:
 * ┌─ 宏任务1 (script) ─┐
 * │  log('1 - sync start')     → 同步执行
 * │  setTimeout → 注册回调到 Task Queue
 * │  Promise.then → 注册回调到 Microtask Queue
 * │  log('4 - sync end')       → 同步执行
 * └─────────────────────┘
 *       ↓
 * ┌─ 清空微任务 ────────┐
 * │  log('3 - promise')
 * └─────────────────────┘
 *       ↓
 * ┌─ 宏任务2 ───────────┐
 * │  log('2 - setTimeout')
 * └─────────────────────┘
 */
```

### 示例 2：微任务的"插队"特性

```javascript
console.log('start');

setTimeout(() => console.log('timeout1'), 0);
setTimeout(() => console.log('timeout2'), 0);

Promise.resolve()
  .then(() => {
    console.log('promise1');
    // 微任务中产生新的微任务 → 仍然在本轮清空
    Promise.resolve().then(() => console.log('promise1-inner'));
  })
  .then(() => console.log('promise2'));

console.log('end');

/*
 * 输出顺序:
 * start
 * end
 * promise1
 * promise1-inner
 * promise2
 * timeout1
 * timeout2
 *
 * 解析:
 * 宏任务(script)执行完 → 微任务队列: [promise1回调]
 *
 * 清空微任务:
 *   执行 promise1 → 输出 "promise1"
 *     → 新增微任务: promise1-inner
 *     → .then链: promise2 被加入微任务队列
 *   微任务队列: [promise1-inner, promise2]
 *   继续清空:
 *     执行 promise1-inner → 输出 "promise1-inner"
 *     执行 promise2 → 输出 "promise2"
 *   微任务队列为空 ✓
 *
 * 下一个宏任务: timeout1
 * 下一个宏任务: timeout2
 */
```

### 示例 3：async/await 的本质还原

```javascript
async function async1() {
  console.log('async1 start');     // 同步
  await async2();                  // async2() 同步执行，但 await 后面的代码进微任务
  console.log('async1 end');       // 微任务
}

async function async2() {
  console.log('async2');           // 同步
}

console.log('script start');
async1();
console.log('script end');

/*
 * 输出顺序:
 * script start
 * async1 start
 * async2
 * script end
 * async1 end
 *
 * 等价转换 (async/await → Promise):
 *
 * function async1() {
 *   console.log('async1 start');
 *   return Promise.resolve(async2()).then(() => {
 *     console.log('async1 end');    // 这行变成了 .then 回调 → 微任务
 *   });
 * }
 */
```

### 示例 4：经典面试题 —— async/await + Promise + setTimeout

```javascript
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

async1();

new Promise((resolve) => {
  console.log('promise1');        // executor 是同步的!
  resolve();
}).then(() => {
  console.log('promise2');
});

console.log('script end');

/*
 * 输出顺序:
 * script start        ← 同步
 * async1 start        ← 同步 (async函数同步执行到第一个await)
 * async2              ← 同步 (await 调用的函数本身同步执行)
 * promise1            ← 同步 (Promise executor 同步执行)
 * script end          ← 同步
 * async1 end          ← 微任务 (await 后续)
 * promise2            ← 微任务 (.then)
 * setTimeout          ← 宏任务
 *
 * 执行流程图:
 *
 * Call Stack:        | Microtask Queue:     | Macrotask Queue:
 * ──────────────────────────────────────────────────────────
 * log(script start)  |                      |
 * log(async1 start)  |                      |
 * log(async2)        |                      |
 *  ← await暂停       | [async1 end 回调]    |
 * log(promise1)      | [async1 end, promise2]|
 *  ← resolve()       |                      | [setTimeout]
 * log(script end)    |                      |
 * ──────────── 宏任务(script)结束 ────────────
 * log(async1 end)    | [promise2]           | [setTimeout]
 * log(promise2)      | []                   | [setTimeout]
 * ──────────── 微任务清空 ─────────────────────
 * log(setTimeout)    |                      | []
 */
```

### 示例 5：queueMicrotask 与 Promise.then 同级

```javascript
console.log('1');

queueMicrotask(() => console.log('2 - queueMicrotask'));

Promise.resolve().then(() => console.log('3 - promise.then'));

queueMicrotask(() => console.log('4 - queueMicrotask'));

setTimeout(() => console.log('5 - setTimeout'), 0);

console.log('6');

/*
 * 输出顺序:
 * 1
 * 6
 * 2 - queueMicrotask     ← 微任务，按注册顺序
 * 3 - promise.then        ← 微任务，按注册顺序
 * 4 - queueMicrotask     ← 微任务，按注册顺序
 * 5 - setTimeout          ← 宏任务
 *
 * 关键: queueMicrotask() 和 Promise.then() 都进入同一个微任务队列，
 *       按照注册(入队)顺序执行，它们之间没有优先级差异。
 */
```

### 示例 6：setTimeout 嵌套与微任务的交替

```javascript
setTimeout(() => {
  console.log('timeout1');
  Promise.resolve().then(() => console.log('promise inside timeout1'));
}, 0);

setTimeout(() => {
  console.log('timeout2');
  Promise.resolve().then(() => console.log('promise inside timeout2'));
}, 0);

Promise.resolve().then(() => {
  console.log('promise1');
  setTimeout(() => console.log('timeout inside promise1'), 0);
});

/*
 * 输出顺序:
 * promise1                    ← 微任务 (script宏任务后清空)
 * timeout1                    ← 宏任务2
 * promise inside timeout1     ← 宏任务2后清空微任务
 * timeout2                    ← 宏任务3
 * promise inside timeout2     ← 宏任务3后清空微任务
 * timeout inside promise1     ← 宏任务4
 *
 * 时间线:
 * ┌─ Macro1: script ──────────────────────────┐
 * │  注册 timeout1, timeout2, promise1         │
 * └────────────────────────────────────────────┘
 *     ↓ 清空微任务
 *     promise1 → 注册 timeout-inside-promise1
 *     ↓
 * ┌─ Macro2: timeout1 ────────────────────────┐
 * │  log timeout1, 注册 promise-inside-timeout1│
 * └────────────────────────────────────────────┘
 *     ↓ 清空微任务
 *     promise inside timeout1
 *     ↓
 * ┌─ Macro3: timeout2 ────────────────────────┐
 * │  log timeout2, 注册 promise-inside-timeout2│
 * └────────────────────────────────────────────┘
 *     ↓ 清空微任务
 *     promise inside timeout2
 *     ↓
 * ┌─ Macro4: timeout inside promise1 ─────────┐
 * └────────────────────────────────────────────┘
 */
```

### 示例 7：微任务"饿死"宏任务（危险示例）

```javascript
// ⚠️ 警告：此代码会阻塞，仅用于理解原理

function危险示例() {
  setTimeout(() => console.log('我永远不会执行'), 0);

  // 微任务不断产生新微任务 → 宏任务永远没机会执行
  function recursiveMicrotask() {
    Promise.resolve().then(() => {
      console.log('微任务执行中...');
      recursiveMicrotask(); // 无限递归微任务
    });
  }
  recursiveMicrotask();
}

// 安全演示版本（限制次数）:
let count = 0;
function safeDemoStarvation() {
  setTimeout(() => console.log('setTimeout - 在所有微任务之后'), 0);

  function addMicrotask() {
    if (count < 5) {
      count++;
      Promise.resolve().then(() => {
        console.log(`microtask ${count}`);
        addMicrotask();
      });
    }
  }
  addMicrotask();
}

safeDemoStarvation();

/*
 * 输出顺序:
 * microtask 1
 * microtask 2
 * microtask 3
 * microtask 4
 * microtask 5
 * setTimeout - 在所有微任务之后
 *
 * 关键原理 (WHATWG 规范原文):
 * "If the microtask queue is not empty:
 *    For each microtask in the microtask queue... perform a microtask checkpoint"
 *
 * 即: 微任务队列必须完全清空后，才会进入下一轮宏任务。
 *     如果微任务不断产生新微任务，宏任务会被"饿死"。
 */
```

### 示例 8：Promise 构造函数 + then 链的精确时序

```javascript
new Promise((resolve) => {
  console.log('1');
  resolve();
  console.log('2');          // resolve() 后的代码仍然同步执行!
}).then(() => {
  console.log('3');
}).then(() => {
  console.log('4');
});

new Promise((resolve) => {
  console.log('5');
  resolve();
}).then(() => {
  console.log('6');
}).then(() => {
  console.log('7');
});

console.log('8');

/*
 * 输出顺序:
 * 1
 * 2
 * 5
 * 8
 * 3
 * 6
 * 4
 * 7
 *
 * 精确解析:
 *
 * 【同步阶段】
 * new Promise1 executor: log(1), resolve(), log(2)
 *   → .then(cb3) 注册到微任务队列   微任务: [cb3]
 *   → .then(cb4) 此时 cb3 还没执行，cb4 是在 cb3 返回的 promise 上注册的，暂不入队
 *
 * new Promise2 executor: log(5), resolve()
 *   → .then(cb6) 注册到微任务队列   微任务: [cb3, cb6]
 *
 * log(8)
 *
 * 【微任务清空阶段】
 * 执行 cb3 → log(3)
 *   → cb3 执行完毕，其返回 promise resolved，cb4 入队   微任务: [cb6, cb4]
 * 执行 cb6 → log(6)
 *   → cb6 执行完毕，cb7 入队                            微任务: [cb4, cb7]
 * 执行 cb4 → log(4)
 * 执行 cb7 → log(7)
 *
 * 注意: then链不是一次性全部注册的! 后续的 .then 要等前一个 .then 的回调执行完才注册。
 */
```

### 示例 9：async 函数返回值与微任务层级

```javascript
async function foo() {
  console.log('foo start');
  const result = await bar();
  console.log('foo end, result:', result);
}

async function bar() {
  console.log('bar start');
  return 'bar result';
}

console.log('global start');
foo();

Promise.resolve()
  .then(() => console.log('promise 1'))
  .then(() => console.log('promise 2'))
  .then(() => console.log('promise 3'));

console.log('global end');

/*
 * 输出顺序:
 * global start
 * foo start
 * bar start
 * global end
 * foo end, result: bar result
 * promise 1
 * promise 2
 * promise 3
 *
 * 解析:
 * 同步: global start → foo start → bar start → global end
 *
 * bar() 返回普通值 'bar result'
 * await 将其包装为 Promise.resolve('bar result')
 * foo 函数在 await 处暂停，await后续代码注册为微任务
 *
 * 微任务队列: [foo的await后续, promise1回调]
 *
 * 执行 foo await 后续 → log('foo end, result: bar result')
 * 执行 promise 1 → 注册 promise 2
 * 执行 promise 2 → 注册 promise 3
 * 执行 promise 3
 */
```

### 示例 10：终极综合题 —— 完整事件循环推演

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  new Promise(resolve => {
    console.log('3');
    resolve();
  }).then(() => {
    console.log('4');
  });
}, 0);

new Promise(resolve => {
  console.log('5');
  resolve();
}).then(() => {
  console.log('6');
});

setTimeout(() => {
  console.log('7');
  queueMicrotask(() => {
    console.log('8');
  });
}, 0);

queueMicrotask(() => {
  console.log('9');
  queueMicrotask(() => {
    console.log('10');
  });
});

async function asyncCall() {
  console.log('11');
  await Promise.resolve();
  console.log('12');
  await Promise.resolve();
  console.log('13');
}

asyncCall();
console.log('14');

/*
 * 输出顺序:
 * 1, 5, 11, 14, 6, 9, 12, 10, 13, 2, 3, 4, 7, 8
 *
 * ===================== 详细推演 =====================
 *
 * ╔══════════════════════════════════════════════════╗
 * ║          宏任务 1: <script> 整体代码              ║
 * ╠══════════════════════════════════════════════════╣
 * ║                                                  ║
 * ║  log('1')                        → 输出: 1       ║
 * ║                                                  ║
 * ║  setTimeout(cb_A, 0)                             ║
 * ║    → cb_A 进入 Macrotask Queue                   ║
 * ║                                                  ║
 * ║  new Promise(executor):                          ║
 * ║    log('5')                      → 输出: 5       ║
 * ║    resolve()                                     ║
 * ║  .then(cb_B)                                     ║
 * ║    → cb_B 进入 Microtask Queue                   ║
 * ║                                                  ║
 * ║  setTimeout(cb_C, 0)                             ║
 * ║    → cb_C 进入 Macrotask Queue                   ║
 * ║                                                  ║
 * ║  queueMicrotask(cb_D)                            ║
 * ║    → cb_D 进入 Microtask Queue                   ║
 * ║                                                  ║
 * ║  asyncCall():                                    ║
 * ║    log('11')                     → 输出: 11      ║
 * ║    await Promise.resolve()                       ║
 * ║    → 暂停, await后续(cb_E)进入 Microtask Queue   ║
 * ║                                                  ║
 * ║  log('14')                       → 输出: 14      ║
 * ║                                                  ║
 * ╠══════════════════════════════════════════════════╣
 * ║  此刻状态:                                       ║
 * ║  Microtask Queue: [cb_B, cb_D, cb_E]            ║
 * ║  Macrotask Queue: [cb_A, cb_C]                  ║
 * ╚══════════════════════════════════════════════════╝
 *          ↓
 * ╔══════════════════════════════════════════════════╗
 * ║          清空微任务队列                            ║
 * ╠══════════════════════════════════════════════════╣
 * ║                                                  ║
 * ║  cb_B: log('6')                  → 输出: 6       ║
 * ║                                                  ║
 * ║  cb_D: log('9')                  → 输出: 9       ║
 * ║    queueMicrotask(cb_F)                          ║
 * ║    → cb_F 进入 Microtask Queue (本轮继续清空)     ║
 * ║                                                  ║
 * ║  cb_E: log('12')                → 输出: 12      ║
 * ║    await Promise.resolve()                       ║
 * ║    → await后续(cb_G)进入 Microtask Queue          ║
 * ║                                                  ║
 * ║  cb_F: log('10')                → 输出: 10      ║
 * ║                                                  ║
 * ║  cb_G: log('13')                → 输出: 13      ║
 * ║                                                  ║
 * ║  Microtask Queue 为空 ✓                          ║
 * ╚══════════════════════════════════════════════════╝
 *          ↓
 * ╔══════════════════════════════════════════════════╗
 * ║          宏任务 2: cb_A (第一个 setTimeout)       ║
 * ╠══════════════════════════════════════════════════╣
 * ║  log('2')                        → 输出: 2       ║
 * ║  new Promise(executor):                          ║
 * ║    log('3')                      → 输出: 3       ║
 * ║    resolve()                                     ║
 * ║  .then(cb_H)                                     ║
 * ║    → cb_H 进入 Microtask Queue                   ║
 * ╠══════════════════════════════════════════════════╣
 * ║  清空微任务:                                      ║
 * ║  cb_H: log('4')                  → 输出: 4       ║
 * ╚══════════════════════════════════════════════════╝
 *          ↓
 * ╔══════════════════════════════════════════════════╗
 * ║          宏任务 3: cb_C (第二个 setTimeout)       ║
 * ╠══════════════════════════════════════════════════╣
 * ║  log('7')                        → 输出: 7       ║
 * ║  queueMicrotask(cb_I)                            ║
 * ║    → cb_I 进入 Microtask Queue                   ║
 * ╠══════════════════════════════════════════════════╣
 * ║  清空微任务:                                      ║
 * ║  cb_I: log('8')                  → 输出: 8       ║
 * ╚══════════════════════════════════════════════════╝
 *
 * 最终输出: 1, 5, 11, 14, 6, 9, 12, 10, 13, 2, 3, 4, 7, 8
 */
```

---

## 四、一张图总结核心算法

```
         ┌──────────────────────────────────────┐
         │           EVENT LOOP CYCLE            │
         └──────────────────────────────────────┘

              ┌─────────────────────┐
         ┌───►│  Pick ONE Macrotask  │
         │    │  (从宏任务队列取一个)  │
         │    └──────────┬──────────┘
         │               │ 执行完毕
         │               ▼
         │    ┌─────────────────────┐
         │    │  Drain ALL Microtasks│◄──┐
         │    │  (清空所有微任务)      │    │ 微任务中产生的
         │    └──────────┬──────────┘    │ 新微任务也在此
         │               │               │ 轮中处理
         │               │ 有新微任务？──►─┘
         │               │ 没有了
         │               ▼
         │    ┌─────────────────────┐
         │    │  Render? (if needed) │
         │    │  rAF → Style →       │
         │    │  Layout → Paint      │
         │    └──────────┬──────────┘
         │               │
         └───────────────┘
              下一轮循环
```

**验证方法**：将以上所有示例粘贴到浏览器 DevTools Console 中运行，对照分析结果验证。
