// 存放全局的 “当前活动的副作用函数”
export let activeEffect = null;
// 面向嵌套的 effect 情况，将外层先压栈，确保 activeEffect 永远指向最内层
const effectStack = [];

// targetMap：用于存放所有依赖的 WeakMap
// 数据结构：WeapMap(obj -> Map(key -> Set(effectFn)))
const targetMap = new WeakMap();

/**
 * 核心：收集依赖 (Track)
 * 在 Proxy 的 get 拦截中调用，将当前的 activeEffect 与这个对象的指定属性绑定起来
 */
export function track(target, key) {
  // 如果没有活动副作用（比如仅仅是 console.log(obj.a) 没有在 effect 或 render 函数里）
  // 就没有必要去收集
  if (!activeEffect) return;

  // 1. 根据原对象，冲 Map 里获取/初始化一个 Map (存放该对象的所有 key 的依赖集合)
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  // 2. 根据具体对象的 key，获取/初始化一个 Set (存放所有依赖于这个 key 的 effect 函数)
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  // 3. 把当前的副作用函数存进去
  dep.add(activeEffect);
  
  // 反向再把 dep 也给当前 effect 装进去，方便 cleanup 时反过来解构依赖关系
  activeEffect.deps.push(dep);
}

/**
 * 核心：触发更新 (Trigger)
 * 在 Proxy 的 set 拦截中调用，把依赖拿出来全跑一遍
 */
export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const effects = depsMap.get(key);
  // 为了防止死循环：在 effect 函数执行时，如果内部不仅读取还修改了同一个值，它就会反复触发自己
  // 把要执行的提取到一个新的 Set 里去遍历
  const effectsToRun = new Set();
  
  effects && effects.forEach(effectFn => {
    // 只有当即将触发的 effect 不是当下正在执行的 effect 时，我们才把它加进去
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn);
    }
  });

  // 执行所有的副作用函数
  effectsToRun.forEach(effectFn => {
    // 核心架构 2：调度器支持 scheduler
    // 如果你在声明 effect 时传了带有 scheduler 的 options
    // 那么触发的时候就不直接 run 了，而是把控制权交给 scheduler！ (这就是 computed 的核心奥秘)
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}

/**
 * effect 函数
 * 用于注册副作用。Vue 中绝大多数的 Watch、Computed 乃至于整个组件的 render 闭包
 * 底层都是依赖这一个 effect
 */
export function effect(fn, options = {}) {
  // 包装一层我们内部需要的副作用逻辑
  const effectFn = () => {
    // 在新一轮执行完毕前，把上次这哥们儿收集的依赖全部清空（分支切换，比如 a ? b : c）
    cleanup(effectFn);

    // 压栈和保存为全局活动 effect
    activeEffect = effectFn;
    effectStack.push(effectFn);
    
    // 执行真正的用户逻辑 (此时里面如果有响应式变量，就会被它的 Proxy get 给拦截进而走到 track)
    const result = fn();
    
    // 弹栈回归
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    
    return result;
  };

  effectFn.options = options;
  // 给它一个兜里的空数组去装它自己所有的 dep，留给下次 cleanup 用
  effectFn.deps = [];

  // 如果 options 中没有声明 lazy: true，那么会立刻同步执行一遍
  if (!options.lazy) {
    effectFn();
  }

  return effectFn;
}

/**
 * 分支切换优化：在执行前，把这个 effectFn 从它所有关联的数据依赖 Set 中删掉
 */
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const depsSet = effectFn.deps[i];
    depsSet.delete(effectFn);
  }
  effectFn.deps.length = 0;
}
