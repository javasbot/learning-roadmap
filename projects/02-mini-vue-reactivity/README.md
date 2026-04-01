# 手写 Vue3 响应式系统项目

## 核心实现（reactive + ref + computed + watch）

```javascript
// ===== 依赖收集系统 =====
let activeEffect = null;
const effectStack = [];
const targetMap = new WeakMap();

function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const result = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return result;
  };
  effectFn.deps = [];
  effectFn.options = options;
  if (!options.lazy) effectFn();
  return effectFn;
}

function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  if (!effects) return;
  const toRun = new Set();
  effects.forEach(e => { if (e !== activeEffect) toRun.add(e); });
  toRun.forEach(e => e.options.scheduler ? e.options.scheduler(e) : e());
}

// ===== reactive =====
function reactive(obj) {
  return new Proxy(obj, {
    get(t, k, r) {
      track(t, k);
      const v = Reflect.get(t, k, r);
      return typeof v === 'object' && v !== null ? reactive(v) : v;
    },
    set(t, k, v, r) {
      const old = t[k];
      const result = Reflect.set(t, k, v, r);
      if (old !== v) trigger(t, k);
      return result;
    }
  });
}

// ===== computed =====
function computed(getter) {
  let value, dirty = true;
  const eff = effect(getter, {
    lazy: true,
    scheduler() { if (!dirty) { dirty = true; trigger(obj, 'value'); } }
  });
  const obj = {
    get value() {
      if (dirty) { value = eff(); dirty = false; }
      track(obj, 'value');
      return value;
    }
  };
  return obj;
}
```

## 学习产出
- [ ] 实现 reactive / ref / computed / watch
- [ ] 实现依赖收集（track）和触发更新（trigger）
- [ ] 支持嵌套对象和数组
- [ ] 处理循环依赖
- [ ] 撰写 2 篇技术博客
