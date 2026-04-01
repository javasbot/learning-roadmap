import { 
  getWipFiber, 
  getCurrentHookIndex, 
  advanceHookIndex,
  currentRoot
} from './render.js';

// 为了防止循环引用，我们绕一个圈子，将触发重新渲染的方法包裹在一个导出的工具里
let __scheduleRender = null;
export function initHooks(scheduleRenderCallback) {
  __scheduleRender = scheduleRenderCallback;
}

/**
 * 手写 useState
 * React 就是一个靠闭包和链表构建的超大状态机。Hook 只能在顶层调用，
 * 因为它们按调用顺序保存在数组/链表中。一旦存在条件语句（如 if 里的 hook），顺序一错位整个程序就崩。
 *
 * @param {*} initial 初始值
 * @returns [state, setState]
 */
export function useState(initial) {
  const wipFiber = getWipFiber();
  const hookIndex = getCurrentHookIndex();

  // 1. 如果组件已经挂载过（不是第一次渲染），从备胎（alternate）上捞出老的 hook 状态
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];

  // 2. 将旧的状态拿过来，如果是初次那就给初始值
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [], // 保存多次 setState 发起的 action 函数（排成队列）
  };

  // 3. 消费掉 setState 积累在 queue 里的所有更新
  // 例如：连续调了 3 次 setState(c => c+1)
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    // action 有可能是具体的值，也有可能回调函数 setState(prev => prev + 1)
    hook.state = typeof action === 'function' ? action(hook.state) : action;
  });

  // 4. 定义 setState 函数（闭包住了当前这一个 hook 的引向）
  const setState = action => {
    // 把用户的更新操作推入队列
    hook.queue.push(action);
    
    // 🔥 最重要的一步：一旦有人调用 setState，我们就重新搭建新的 Fiber 树让引擎去跑
    if (__scheduleRender) {
      __scheduleRender();
    }
  };

  // 5. 把组装好的这个 hook 推进 wipFiber（就是当前正在执行的函数组件）下属的 hooks 数组中，挂着
  wipFiber.hooks.push(hook);
  advanceHookIndex();

  return [hook.state, setState];
}
