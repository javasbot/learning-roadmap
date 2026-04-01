# 内存管理与垃圾回收（GC）深度解析

> **权威来源**：[V8 Blog - Trash Talk](https://v8.dev/blog/trash-talk)、[MDN - Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)

## 一、V8 内存结构

### 1.1 堆内存布局

```
V8 Heap
├── New Space (新生代)          1-8 MB
│   ├── Semi-space A (From)
│   └── Semi-space B (To)
├── Old Space (老生代)          大部分内存
│   ├── Old Pointer Space      包含指向其他对象的指针
│   └── Old Data Space         仅包含数据（字符串、数组等）
├── Large Object Space          大于 kMaxRegularHeapObjectSize 的对象
├── Code Space                  JIT 编译的代码
└── Map Space                   隐藏类（Maps）
```

### 1.2 新生代 vs 老生代

| 特性 | 新生代 (Young Generation) | 老生代 (Old Generation) |
|------|--------------------------|------------------------|
| 大小 | 1-8 MB | 数百MB到GB |
| 对象特点 | 生命周期短、分配频繁 | 存活时间长 |
| GC 算法 | Scavenge (Cheney) | Mark-Sweep + Mark-Compact |
| GC 频率 | 高频、耗时短 | 低频、耗时长 |
| 晋升条件 | 经历2次 Scavenge 仍存活 | — |

## 二、垃圾回收算法

### 2.1 新生代 — Scavenge 算法（Cheney 算法）

```
Scavenge 过程:

Before GC:
┌─────────────────┐  ┌─────────────────┐
│  From Space     │  │   To Space      │
│ ┌───┐ ┌───┐    │  │   (空)           │
│ │ A │ │ B │    │  │                 │
│ └───┘ └───┘    │  │                 │
│   ┌───┐        │  │                 │
│   │ C │(已死)   │  │                 │
│   └───┘        │  │                 │
└─────────────────┘  └─────────────────┘

After GC (存活对象复制到 To Space, 空间互换):
┌─────────────────┐  ┌─────────────────┐
│   To Space      │  │  From Space     │
│   (空)           │  │ ┌───┐ ┌───┐    │
│                 │  │ │ A │ │ B │    │
│                 │  │ └───┘ └───┘    │
└─────────────────┘  └─────────────────┘
                     (原 From 变 To, 原 To 变 From)
```

**优点**：速度快，不产生内存碎片
**缺点**：空间利用率只有 50%

### 2.2 老生代 — Mark-Sweep（标记清除）

```javascript
// 标记阶段：从根集合（Root Set）出发，DFS标记所有可达对象
// 根集合包括：全局对象、调用栈中的变量、活跃的闭包等

// Phase 1: Mark（标记）
// 从 GC Root 开始遍历
// GC Root → A → B → D (可达，标记为活跃)
// C, E 不可达，不标记

// Phase 2: Sweep（清除）
// 遍历堆，回收所有未标记的对象
```

```
Mark 阶段:
GC Root
  │
  ├──→ A (标记 ✓)
  │    └──→ B (标记 ✓)
  │         └──→ D (标记 ✓)
  │
  └──→ F (标记 ✓)

未标记: C, E → 被回收

Sweep 阶段:
┌───┬───┬─────┬───┬─────┬───┐
│ A │ B │ ░░░ │ D │ ░░░ │ F │   ← ░░░ 为空闲内存（碎片化！）
└───┴───┴─────┴───┴─────┴───┘
```

### 2.3 老生代 — Mark-Compact（标记整理）

解决 Mark-Sweep 的内存碎片问题：

```
Mark-Compact:
标记完成后，将所有存活对象向一端移动，然后清除边界外的内存

Before:
┌───┬───┬─────┬───┬─────┬───┐
│ A │ B │ ░░░ │ D │ ░░░ │ F │
└───┴───┴─────┴───┴─────┴───┘

After:
┌───┬───┬───┬───┬─────────────┐
│ A │ B │ D │ F │  连续空闲空间 │
└───┴───┴───┴───┴─────────────┘
```

### 2.4 增量标记（Incremental Marking）

为避免长时间 GC 停顿（Stop-The-World），V8 使用增量标记：

```
传统 Mark-Sweep (全停顿):
JS执行 ────────█████████████████──────────── JS执行
                 GC (100ms+)

增量标记:
JS执行 ──█──JS──█──JS──█──JS──█──JS── JS执行
          5ms   5ms   5ms   5ms
```

**三色标记法**：
- **白色**：未被访问的对象
- **灰色**：自身已访问，但引用的对象未全部访问
- **黑色**：自身和引用的对象都已访问

```
增量标记过程:
1. 初始：所有对象为白色
2. 从根集合开始，将直接可达对象标记为灰色
3. 每次增量步骤：取一个灰色对象，将其标记为黑色，其引用的白色对象标记为灰色
4. 直到没有灰色对象
5. 所有白色对象即为垃圾
```

### 2.5 并发标记（Concurrent Marking）

V8 从 6.4 版本开始支持并发标记，在辅助线程中执行标记工作：

```
主线程:  JS执行 ────── JS执行 ────── 最终化标记(短暂暂停) ── JS执行
辅助线程:      ████ 并发标记 ████
```

## 三、常见内存泄漏模式

### 3.1 闭包泄漏

```javascript
// ⚠️ 闭包持有外部变量引用
function createLeak() {
  const bigData = new Array(1000000).fill('leak');
  
  return function() {
    // 虽然没有直接使用 bigData
    // 但闭包的作用域链仍然引用了它
    console.log('hello');
  };
}

const leak = createLeak();
// bigData 无法被回收，因为 leak 的闭包引用了它
```

### 3.2 事件监听器泄漏

```javascript
// ⚠️ 未移除的事件监听器
class Component {
  constructor() {
    this.data = new Array(10000);
    // 添加了监听器但忘记移除
    window.addEventListener('resize', this.handleResize);
  }
  
  handleResize = () => {
    console.log(this.data.length);
  };
  
  // ✅ 必须在组件卸载时移除
  destroy() {
    window.removeEventListener('resize', this.handleResize);
  }
}
```

### 3.3 DOM 分离节点泄漏

```javascript
// ⚠️ DOM 节点移除后仍被 JS 引用
let detachedNode;

function createNode() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  detachedNode = div;  // JS 引用
}

function removeNode() {
  document.body.removeChild(detachedNode);  
  // DOM 树中移除了，但 detachedNode 变量仍引用
  // 导致 DOM 节点无法被 GC
  
  // ✅ 修复: detachedNode = null;
}
```

### 3.4 定时器泄漏

```javascript
// ⚠️ 未清除的定时器
function startPolling() {
  const data = fetchHugeData();
  
  setInterval(() => {
    // 定时器回调引用了 data
    process(data);
  }, 1000);
  // 如果不清除 interval，data 永远不会被回收
}

// ✅ 修复
function startPolling() {
  const data = fetchHugeData();
  const timer = setInterval(() => {
    process(data);
  }, 1000);
  
  return () => clearInterval(timer);  // 返回清理函数
}
```

## 四、内存泄漏排查实战

### 4.1 Chrome DevTools Memory 面板

```
排查步骤：
1. 打开 DevTools → Memory
2. 选择 "Heap snapshot"
3. 执行可能泄漏的操作前，拍摄 Snapshot 1
4. 执行操作（如打开关闭弹窗10次）
5. 手动触发 GC（点击垃圾桶图标）
6. 拍摄 Snapshot 2
7. 选择 "Comparison" 视图，对比两个快照
8. 按 "Delta" 排序，查找新增且未释放的对象
9. 展开对象查看 "Retainers"（是谁持有了这个对象的引用）
```

### 4.2 Performance Monitor

```
实时监控指标：
- JS Heap Size: JS 堆内存大小（持续增长即泄漏）
- DOM Nodes: DOM 节点数量
- JS Event Listeners: 事件监听器数量
- Documents: 文档数量（iframe 泄漏）
```

## 五、面试高频题

### Q1: V8 的垃圾回收机制是怎样的？
**答**：V8 采用分代回收策略。新生代使用 Scavenge（Cheney）算法，将存活对象在两个 Semi-space 之间复制；老生代使用 Mark-Sweep（标记清除）和 Mark-Compact（标记整理），并通过增量标记和并发标记减少 GC 停顿时间。

### Q2: WeakRef 和 FinalizationRegistry 的用途？
**答**：`WeakRef` 创建对对象的弱引用，不阻止 GC 回收目标对象；`FinalizationRegistry` 在对象被 GC 回收后执行回调。常用于实现不影响 GC 的缓存机制。

```javascript
const registry = new FinalizationRegistry((value) => {
  console.log(`对象 ${value} 被回收了`);
});

let obj = { data: 'heavy' };
const weakRef = new WeakRef(obj);
registry.register(obj, 'my-object');

obj = null;  // 允许 GC 回收
// 稍后某次 GC 触发: "对象 my-object 被回收了"
```

### Q3: 如何避免内存泄漏的最佳实践？
**答**：1) 组件卸载时移除事件监听器和定时器；2) 避免不必要的全局变量；3) 注意闭包对大对象的引用；4) 使用 WeakMap/WeakSet 存储对 DOM 的引用；5) 定期使用 DevTools Memory 进行 Profile。
