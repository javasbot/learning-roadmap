# Mini-React 实现原理深度解析

> 面试高频问题：什么是 Fiber？为什么要从 15 的机制改过来？React hook 的闭包陷阱产生的原因是什么？手写一下简版 React。

## 背景剖析
React 15 时期的 **Stack Reconciler** 是一个“基于递归调用栈”的计算机制。这就导致当整个组件树非常大的时候，一旦调用 `render`，它就会在内存里一直同步、深度优先地递归下去，直到挂载或者比较完所有的虚拟 DOM 为止。这长达即便只有 200ms 的纯 JS 运算时长也会导致页面卡顿掉帧，因为它没法出借时间给浏览器做动画和点击响应。

## Step 1: `createElement`
这就是 JSX 被 Babel/swc 编译过后的产出物。它的本质就是把你写的标签全部转换成一个对象：
```json
{
  "type": "div",
  "props": { "id": "app", "children": [...] }
}
```
这也是为什么我们在 `app.js` 头部甚至需要写 `/** @jsx Didact.createElement */` —— 让编译器知道遇到标签别用 `React.createElement`，用我们自己的。在这个模块中，还特别对文本类型包了一层 `TEXT_ELEMENT`。

## Step 2: `workLoop` - Fiber 时代的核心
Fiber 的核心本质是什么？**将树状的递归遍历，扁平化成单链表的遍历**（`child` -> `sibling` -> `parent`），并通过浏览器的 `requestIdleCallback` 实现了时间切片。

> V8 规定如果是纯计算的同步栈调用，你永远无法从外部 `throw` 断点打断它。唯独使用全局异步事件循环或者宏任务，让它自己“每做完一个结点，查一下手表（看看 `requestIdleCallback` 给的 16ms 用光没）”。没用光继续；用光了保存现场（挂起指针），把主线程交还给浏览器。这叫**协程与协作式调度**。

## Step 3: `reconciler` (Diff 算法)
这可以说是 React 最复杂的模块，也是**时间换空间**的地方。我们新写出的 JSX 是树结构（`elements`），我们要在**内存里**跟上一次渲染在屏幕上留下的那棵 `alternate` 旧树（也就是双缓冲，两套实例来回切）进行 Diff。
这一步完全处于静默中，不会操作真实界面，只会单纯地给新的 Virtual Dom 对象打标贴标签：
- `PLACEMENT` (新增的)
- `UPDATE` (复用的)
- `DELETION` (要拆掉的)

## Step 4: `commitRoot` (DOM 一脚挂载)
当 `requestIdleCallback` 磨破了嘴皮子，一段段把这个几千张节点的树上的标签全部打完了。引擎就会判定“工作完成”。随后进入一段连续、**不可中断**的高速 DOM 插入和修改期。
这就保证了用户绝对不会产生任何闪烁或者“DOM 树生长了一半”的错觉。

## Step 5: 手工打造 `useState` 以及闭包陷阱的解法
React 为什么警告你不能把 Hooks 放进 `if` 条件语句里？
看这个项目源码就知道，`useState` 压根没有接受你在创建时赋予类似 `key` 一样唯一的标识符！它是按你的组件每一次在里面 `wipFiber.hooks.push(hook)` 的**次序下标**存进数组里的。
你如果拿个条件语句一挡，第二次运行渲染函数时，下标全乱了。原本是 name 的 state 指向了 age，导致灾难级的内存覆盖。
这也就是真正的 Hooks 核心运行原理。
