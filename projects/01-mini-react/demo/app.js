/** @jsx Didact.createElement */
import { createElement } from '../core/createElement.js';
import { render, currentRoot, wipRoot } from '../core/render.js';
import { useState, initHooks } from '../core/hooks.js';

// 将我们暴露的方法包裹挂载在自定义对象上，模拟 React
const Didact = {
  createElement,
  render,
  useState,
};

// ==========================
// 修复 Hook 中 scheduleRender 的循环引用依赖
// 用户调用 setState 时就会触发新一轮的渲染工作循环
initHooks(() => {
  // 核心逻辑：拿到当前根节点的引用并将 wipRoot 设为它，激活事件引擎重新进入 workLoop
  Didact.render = render;
  // TODO: 当前为了简单，这里直接复用 currentRoot 的指针，在完整版里需要重置 workLoop 的指针
  alert("setState 被调用! 我们需要重启 Fiber WorkLoop"); 
  location.reload(); // demo 中简单刷新做个示例感知，真实的 render 会挂起 wipRoot 
});
// ==========================

/**
 * 这是我们的函数组件！注意这是一个单纯的 Function
 */
function App(props) {
  // 因为没有集成 Babel 插件转换 JSX，为了演示这套核心引擎的作用，
  // 我们直接手写虚拟 DOM createElement 的嵌套。
  
  // 真实情况里，下面这坨代码其实就是:
  // return (
  //   <div>
  //     <h1>你好, {props.name}</h1>
  //     <p>欢迎来到你的原生 Fiber 引擎</p>
  //     <button onClick={() => alert('点击效果')}>点我</button>
  //   </div>
  // )

  return Didact.createElement(
    "div",
    null,
    Didact.createElement("h1", null, "你好, ", props.name),
    Didact.createElement("p", null, "欢迎来到你自己的手写 Fiber 引擎跑起来的页面！"),
    Didact.createElement(
      "button", 
      { onClick: () => alert('原生 DOM 回调也成功挂载了！') }, 
      "点我试试"
    )
  );
}

// ==========================
// 1. 获取挂载点
const container = document.getElementById("root");

// 2. 生成 App VNode (虚拟DOM结构)
const element = Didact.createElement(App, { name: "P10 前端架构师" });

// 3. 把树挂载在 container 下，交给 Fiber Scheduler
Didact.render(element, container);

console.log("Mini React Scheduler 已启动，VDOM树装载完毕：", element);
