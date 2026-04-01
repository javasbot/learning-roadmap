import { reactive } from '../core/reactive.js';
import { effect } from '../core/effect.js';
// 假设这里我们也导出了自己写的计算属性（暂时在 effect.js 中未完全实现所有边界，但原理已写明）

// 1. 初始化深度响应式对象
const state = reactive({
  count: 0
});

// 2. 拿到我们需要疯狂操作 DOM 的元素
const countDisplay = document.getElementById("count-display");
const doubleDisplay = document.getElementById("double-display");
const btn = document.getElementById("btn");

// 3. 核心：组件 Render 的闭包本质
// 为什么我们在 Vue 写模板 {{ count }} 就能自动更新页面？
// 因为 Vue 在底层偷偷地把你写的所有的 <template> 或者 render() 包进了下面这个 effect 函数里去跑！！！
effect(() => {
  // 这是用户的执行逻辑，里面读了 state.count（触发了 reactive Proxy 的 GET 拦截器）
  // -> 进而触发了 core 里的 track 依赖收集，他把当前的这一段 effect 方法死死绑定在了 count 身上
  console.log("【Effect 触发】正在重新渲染视图...");
  countDisplay.textContent = state.count;
  doubleDisplay.textContent = `双倍: ${state.count * 2}`;
});

// 4. 用户点击触发数据修改
btn.addEventListener("click", () => {
  // 用户的确只是简简单单修改了对象上的数据，压根没有直接去调更新界面的代码
  // -> 触发了 Proxy 的 SET 拦截器
  // -> 进而触发了 trigger，把小本本里刚刚存好的包含上面 `countDisplay.textContent` 赋值语句的方法全都拿出来跑一遍
  state.count++;
});

console.log("🏁 响应式系统引擎挂载完毕。尝试点击按钮体验纯数据驱动思想！");
