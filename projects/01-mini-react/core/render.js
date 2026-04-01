import { reconcileChildren } from './reconciler.js';

// ============ 全局运行状态 ============
// 当前正在执行工作单元的 Fiber 节点
export let nextUnitOfWork = null;

// 正在构建中的整棵 Fiber 树（工作中的树）
export let wipRoot = null;

// 上一次已经提交到屏幕上的也是 current 树（双缓冲）
export let currentRoot = null;

// 在 render 阶段收集到的、需要在 commit 阶段删除的旧节点数组
export let deletions = null;

// 当前正在渲染的函数组件 Fiber 节点（给 hooks 用的）
export let wipFiber = null;
export let hookIndex = null;

/**
 * 启动并指定我们的应用挂载的根节点
 * 等价于 ReactDOM.render(<App />, document.getElementById('root'))
 */
export function render(element, container) {
  // 构建第一个 Fiber 节点，这也是 Root Fiber
  wipRoot = {
    dom: container, // 对应的真实 DOM
    props: {
      children: [element],
    },
    alternate: currentRoot, // 它的备胎就是页面上当前展现的旧 Fiber 树
  };
  
  deletions = [];
  nextUnitOfWork = wipRoot;
}

/**
 * 给 Hooks 导出设置全局变量的能力
 */
export function setHookGlobals(fiber, idx) {
  wipFiber = fiber;
  hookIndex = idx;
}

export function getCurrentHookIndex() { return hookIndex; }
export function getWipFiber() { return wipFiber; }
export function advanceHookIndex() { hookIndex++; }

/**
 * Fiber 的工作循环：Scheduler (调度器)
 * 利用浏览器的 requestIdleCallback 在主线程空闲时执行任务
 * 这样复杂的渲染就不会阻塞页面交互（动画/输入等）
 */
function workLoop(deadline) {
  let shouldYield = false;
  
  // 如果有任务 且 浏览器还有空闲时间，就一直干活
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 如果没有接下来的任务了，并且有一棵未提交的工作树
  // 说明整棵树已经“在内存里”遍历、diff 并创建好 DOM 完毕了，进入 commit 阶段！
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  // 循环注册下一个空闲回调
  requestIdleCallback(workLoop);
}
// 启动事件循环
requestIdleCallback(workLoop);

/**
 * performUnitOfWork - 执行单个工作单元
 * 它要做两件事：
 * 1. 把当前 fiber 节点的活干了（创建 DOM、执行函数组件等）
 * 2. 返回下一个要处理的 fiber 节点（遍历顺序：深度优先 -> 子节点 -> 兄弟节点 -> 叔叔节点）
 */
function performUnitOfWork(fiber) {
  // 区分函数组件和原生宿主组件(div, span)
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber); // 1a. 函数组件
  } else {
    updateHostComponent(fiber);     // 1b. 宿主组件
  }

  // 2. 返回下一个工作单元
  // 有子节点，先去子节点
  if (fiber.child) {
    return fiber.child;
  }
  // 没子节点，找兄弟节点；没兄弟了，找叔叔节点 (退回父级的兄弟)
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

/** --------------- 更新原生 DOM 组件 --------------- **/
function updateHostComponent(fiber) {
  // 如果当前 fiber 还没有真实 DOM（首次渲染的新节点），创建它
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  
  // 将子虚拟节点转化为 Fiber 树结构，并决定打上什么标记（PLACEMENT/UPDATE/DELETION）
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
}

/** --------------- 更新 Function 组件 --------------- **/
function updateFunctionComponent(fiber) {
  // 函数组件的初始化，重置 hooks 数据
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = []; // 每个函数组件都会挂载一个数组用于存放 useState 生成的 hook

  // 核心：执行函数组件自身，比如 App()
  // 返回的值就是它的 JSX 树（虚拟 DOM）
  const children = [fiber.type(fiber.props)];
  
  reconcileChildren(fiber, children);
}

/** --------------- 真实 DOM 的创建与操作 --------------- **/
function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);
  return dom;
}

const isEvent = key => key.startsWith("on");
const isProperty = key => key !== "children" && !isEvent(key);
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);

export function updateDom(dom, prevProps, nextProps) {
  // 移除旧的、或者发生变化的事件监听器
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除已经不存在的普通属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = "";
    });

  // 增加或者更新新的普通属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    });

  // 绑定新的事件监听器
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

/** --------------- Commit 阶段 (不可中断) --------------- **/
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot; // 保存当前屏幕视图状态作为备胎
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  
  // 找到最近的拥有真实 DOM 的父祖节点
  // 因为像 <App> 这种 Function Component 是没有实际 DOM 节点的
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  // 根据 diff 中打下的标记（effectTag）操作真实 DOM
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }

  // 递归 commit 子节点
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  // 如果当前 fiber 没有对应 DOM，继续往下找它带 DOM 的孩子去删
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}
