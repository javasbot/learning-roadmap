# React Fiber 架构设计原理

> **权威来源**：[React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)、[React 源码](https://github.com/facebook/react/tree/main/packages/react-reconciler)

## 一、为什么需要 Fiber？

### 1.1 React 15 的问题：Stack Reconciler

```
React 15 递归更新（Stack Reconciler）:

render → diff → update DOM  （同步递归，不可中断）
│                            │
├── Component A              │
│   ├── Component B          │  一旦开始，必须完成整棵树
│   │   └── Component D      │  如果组件树很大（如1000个节点）
│   └── Component C          │  会导致长达数百毫秒的主线程阻塞
│       └── Component E      │  用户输入、动画全部卡顿
└── 完成                      │
```

**核心问题**：JavaScript 是单线程的，同步递归渲染无法中断，长时间占用主线程会导致掉帧。

### 1.2 Fiber 的解决方案

```
React 16+ Fiber 架构:

工作单元1  工作单元2  工作单元3
    │          │          │
    ▼          ▼          ▼
  ┌──┐ yield ┌──┐ yield ┌──┐
  │A │──────▶│B │──────▶│C │ ──▶ ...
  └──┘       └──┘       └──┘
       ↑                      ↑
   浏览器检查:            浏览器检查:
   有用户输入?            有高优先级任务?
   需要渲染?              动画帧到了?
```

**Fiber 将渲染工作拆分为可中断的小单元（Unit of Work）。**

## 二、Fiber 节点结构

```javascript
// Fiber 节点的核心属性（简化版）
interface FiberNode {
  // ===== 静态数据 =====
  tag: WorkTag;           // 组件类型（FunctionComponent / HostComponent 等）
  type: any;              // 对应 React 元素的 type（如 'div', App）
  key: null | string;     // 唯一标识

  // ===== 树结构 — 链表 =====
  return: FiberNode | null;    // 父节点
  child: FiberNode | null;     // 第一个子节点
  sibling: FiberNode | null;   // 下一个兄弟节点
  index: number;               // 在父节点中的索引

  // ===== 工作单元 =====
  pendingProps: any;       // 新的 props
  memoizedProps: any;      // 上次渲染的 props
  memoizedState: any;      // 上次渲染的 state（Hooks 链表头）
  updateQueue: any;        // 更新队列

  // ===== 副作用 =====
  flags: Flags;            // 副作用标记（Placement / Update / Deletion）
  subtreeFlags: Flags;     // 子树副作用标记
  
  // ===== 双缓冲 =====
  alternate: FiberNode | null; // 对应的另一个 Fiber 节点

  // ===== 调度 =====
  lanes: Lanes;            // 优先级
  childLanes: Lanes;       // 子树中的优先级
}
```

### 2.1 Fiber 树是链表结构

```
       ┌─────┐
       │ App │ ◄── 根 Fiber
       └──┬──┘
          │ child
       ┌──▼──┐
       │ div │
       └──┬──┘
          │ child
       ┌──▼──┐ sibling ┌──────┐ sibling ┌──────┐
       │ h1  │────────▶│  p   │────────▶│ List │
       └─────┘         └──────┘         └──┬───┘
                                           │ child
                                        ┌──▼──┐ sibling ┌─────┐
                                        │ li  │────────▶│ li  │
                                        └─────┘         └─────┘

每个节点通过 return 指向父节点（省略图示）
```

**为什么用链表而不是树？** 链表结构可以在任何节点暂停遍历，保存当前位置，之后从断点恢复。递归树结构无法做到这一点（调用栈是隐式的）。

## 三、双缓冲机制（Double Buffering）

```
Current Fiber Tree              workInProgress Fiber Tree
（当前屏幕显示的）                （正在构建的）

    ┌─────┐                         ┌─────┐
    │ App │ ◄── alternate ──────▶  │ App │
    └──┬──┘                        └──┬──┘
       │                              │
    ┌──▼──┐                        ┌──▼──┐
    │ div │ ◄── alternate ──────▶  │ div │ (可能有不同的 props)
    └──┬──┘                        └──┬──┘
       │                              │
    ┌──▼──┐                        ┌──▼──┐
    │ h1  │ ◄── alternate ──────▶  │ h1  │
    └─────┘                        └─────┘

构建完成后：交换 current 指针
fiberRootNode.current = workInProgress;
workInProgress 变成新的 current
```

**优势**：
1. 新树构建过程中，旧树保持不变（用户看到的不会闪烁）
2. 如果新树构建被中断，旧树仍完整可用
3. 构建完成后，只需切换指针即可"提交"更新

## 四、工作循环（Work Loop）

### 4.1 核心循环

```javascript
// 简化的 Fiber 工作循环
function workLoopConcurrent() {
  // 当有待处理的工作单元 且 时间片没用完
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function workLoopSync() {
  // 同步模式：不检查时间片
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}
```

### 4.2 单个工作单元的执行

```javascript
function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  
  // ===== Render 阶段 =====
  // beginWork: 递（递归的递）
  // 处理当前 Fiber，创建子 Fiber
  let next = beginWork(current, unitOfWork, renderLanes);
  
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  
  if (next === null) {
    // 没有子节点了，开始归
    // completeWork: 归（递归的归）
    completeUnitOfWork(unitOfWork);
  } else {
    // 继续处理子节点
    workInProgress = next;
  }
}
```

### 4.3 遍历顺序：深度优先

```
遍历顺序（beginWork递 + completeWork归）:

         App
        / | \
       A  B  C
      /       \
     D         E

beginWork 顺序: App → A → D → B → C → E
completeWork 顺序: D → A → B → E → C → App

具体路径:
1. beginWork(App)    → child = A
2. beginWork(A)      → child = D
3. beginWork(D)      → child = null (叶子节点)
4. completeWork(D)   → sibling = null, return to A
5. completeWork(A)   → sibling = B
6. beginWork(B)      → child = null
7. completeWork(B)   → sibling = C
8. beginWork(C)      → child = E
9. beginWork(E)      → child = null
10. completeWork(E)  → sibling = null, return to C
11. completeWork(C)  → sibling = null, return to App
12. completeWork(App) → 完成！
```

## 五、beginWork 与 completeWork

### 5.1 beginWork（递阶段）

```javascript
function beginWork(current, workInProgress, renderLanes) {
  // 如果有 current（即 update 而非 mount）
  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;
    
    // 优化：如果 props 没变，尝试跳过（bailout）
    if (oldProps === newProps && !hasContextChanged()) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress);
    }
  }
  
  // 根据 Fiber 类型处理
  switch (workInProgress.tag) {
    case FunctionComponent:
      return updateFunctionComponent(current, workInProgress, renderLanes);
    case ClassComponent:
      return updateClassComponent(current, workInProgress, renderLanes);
    case HostComponent: // 如 <div>
      return updateHostComponent(current, workInProgress);
    // ...更多类型
  }
}
```

### 5.2 completeWork（归阶段）

```javascript
function completeWork(current, workInProgress) {
  switch (workInProgress.tag) {
    case HostComponent: {
      if (current !== null && workInProgress.stateNode != null) {
        // Update: 对比属性差异，收集 update 副作用
        updateHostComponent(current, workInProgress);
      } else {
        // Mount: 创建 DOM 节点
        const instance = createInstance(workInProgress.type, workInProgress.pendingProps);
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
      }
      
      // 冒泡子树的副作用标记
      bubbleProperties(workInProgress);
      return null;
    }
  }
}
```

## 六、Commit 阶段

Render 阶段完成后，进入 Commit 阶段（同步、不可中断）：

```
Commit 阶段三个子阶段:

1. Before Mutation 阶段
   └── 调用 getSnapshotBeforeUpdate（class组件）
   └── 调度 useEffect

2. Mutation 阶段
   └── 执行 DOM 操作（增/删/改）
   └── Placement: appendChild/insertBefore
   └── Update: 更新 DOM 属性
   └── Deletion: removeChild + 清理 ref，调用 useEffect cleanup

3. Layout 阶段
   └── 调用 useLayoutEffect
   └── 调用 componentDidMount/componentDidUpdate
   └── 更新 ref
```

## 七、面试高频题

### Q1: React 为什么使用 `requestIdleCallback` 的思路？实际用了什么？

**答**：React 的 Scheduler 借鉴了 `requestIdleCallback` 的思路（利用浏览器空闲时间执行任务），但实际使用的是 `MessageChannel`。原因：
1. `requestIdleCallback` 的执行频率太低（大约 20fps）
2. Safari 不支持 `requestIdleCallback`
3. `MessageChannel` 的回调在宏任务中执行，频率更高且更可控
4. React 自己实现了 5ms 的时间切片来模拟 `requestIdleCallback` 的效果

### Q2: Fiber 的双缓冲有什么好处？

**答**：
1. **无闪烁更新**：新树构建完成前，旧树始终可用
2. **可中断渲染**：中断后旧树不受影响
3. **内存优化**：通过 `alternate` 复用 Fiber 节点，减少创建和 GC 压力

### Q3: 为什么 Fiber 树是链表结构？

**答**：链表结构允许在任意节点暂停和恢复遍历（通过 `child / sibling / return` 指针），而传统的递归树遍历依赖调用栈，无法在中间暂停。Fiber 通过显式指针将隐式的调用栈"外化"为数据结构。
