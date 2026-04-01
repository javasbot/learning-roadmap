# 手写 Mini React 项目

## 项目目标

从零实现一个简化版 React，深入理解 Fiber 架构、Reconciler、Hooks 系统和并发模式。

## 技术栈
- 纯 JavaScript（无依赖）
- 实现 JSX 支持（Babel 插件）

## 核心功能实现

### 1. createElement（虚拟DOM）

```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'object' ? child : createTextElement(child)
      )
    }
  };
}

function createTextElement(text) {
  return { type: 'TEXT_ELEMENT', props: { nodeValue: text, children: [] } };
}
```

### 2. Fiber 工作循环

```javascript
let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && wipRoot) commitRoot();
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);
```

### 3. Reconciler（Diff算法）

```javascript
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate?.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;
    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      newFiber = { type: oldFiber.type, props: element.props, dom: oldFiber.dom,
        parent: wipFiber, alternate: oldFiber, effectTag: 'UPDATE' };
    }
    if (element && !sameType) {
      newFiber = { type: element.type, props: element.props, dom: null,
        parent: wipFiber, alternate: null, effectTag: 'PLACEMENT' };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }
    if (oldFiber) oldFiber = oldFiber.sibling;
    if (index === 0) wipFiber.child = newFiber;
    else if (element) prevSibling.sibling = newFiber;
    prevSibling = newFiber;
    index++;
  }
}
```

### 4. useState Hook

```javascript
let wipFiber = null;
let hookIndex = null;

function useState(initial) {
  const oldHook = wipFiber.alternate?.hooks?.[hookIndex];
  const hook = { state: oldHook ? oldHook.state : initial, queue: [] };
  
  (oldHook?.queue || []).forEach(action => {
    hook.state = typeof action === 'function' ? action(hook.state) : action;
  });

  const setState = action => {
    hook.queue.push(action);
    wipRoot = { dom: currentRoot.dom, props: currentRoot.props, alternate: currentRoot };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}
```

## 学习产出

- [ ] 完成 createElement + render
- [ ] 实现 Fiber 工作循环（可中断渲染）
- [ ] 实现 Reconciler + Diff
- [ ] 实现 useState
- [ ] 实现 useEffect
- [ ] 撰写 3 篇技术博客
- [ ] GitHub 开源
