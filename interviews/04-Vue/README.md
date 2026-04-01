# Vue 面试题

## Q1: Vue 3 vs Vue 2 核心变化 [P7]

| 特性 | Vue 2 | Vue 3 |
|------|-------|-------|
| 响应式 | Object.defineProperty | **Proxy** |
| API | Options API | **Composition API** |
| 渲染 | Virtual DOM | **编译时优化** |
| Tree-shaking | ❌ 全量引入 | ✅ 按需引入 |
| TypeScript | 差 | **一等公民** |
| Teleport | ❌ | ✅ |
| Fragments | ❌ | ✅ (多根节点) |

## Q2: Proxy vs Object.defineProperty [P8]

```javascript
// Vue 2: Object.defineProperty — 有限制
// ❌ 无法检测属性新增/删除 (需 $set/$delete)
// ❌ 无法检测数组索引赋值 (arr[0] = x)
// ❌ 需要递归遍历对象所有属性

// Vue 3: Proxy — 无限制
const handler = {
  get(target, key, receiver) {
    track(target, key);  // 依赖收集
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    trigger(target, key);  // 触发更新
    return result;
  },
  deleteProperty(target, key) {
    const result = Reflect.deleteProperty(target, key);
    trigger(target, key);
    return result;
  }
};
// ✅ 支持属性新增/删除
// ✅ 支持数组索引
// ✅ 惰性代理（访问时才递归）
```

## Q3: Vue 3 编译时优化 [P9]

```html
<template>
  <div>
    <h1>静态标题</h1>        <!-- 静态提升：只创建一次 -->
    <p>{{ dynamicText }}</p>  <!-- patchFlag: TEXT -->
    <div :class="cls">       <!-- patchFlag: CLASS -->
      <span>静态内容</span>
    </div>
  </div>
</template>
```

**编译优化策略**：
1. **静态提升(Static Hoisting)**：静态节点只创建一次，后续复用
2. **Patch Flags**：标记动态节点类型（TEXT=1, CLASS=2, STYLE=4...），跳过静态比较
3. **Block Tree**：只收集有 patchFlag 的动态节点组成 Block，Diff 时只比较 Block 内节点
4. **缓存事件处理函数**：`@click="handler"` 只创建一次

## Q4: ref vs reactive 区别 [P7]

```javascript
import { ref, reactive } from 'vue';

// ref: 任意类型, 需要 .value 访问
const count = ref(0);
count.value++;  // 需要 .value

// reactive: 仅对象类型, 直接访问
const state = reactive({ count: 0 });
state.count++;  // 直接访问

// ⚠️ reactive 的陷阱
let obj = reactive({ name: 'Vue' });
obj = { name: 'React' };  // ❌ 失去响应式！（重新赋值）

// 解构也会失去响应性
const { name } = reactive({ name: 'Vue' }); // ❌ name不是响应式
const { name } = toRefs(reactive({ name: 'Vue' })); // ✅ 用toRefs

// 最佳实践: ref用于基本类型, reactive用于对象组
```

## Q5: watch vs watchEffect [P7]

```javascript
// watch: 明确指定监听源，可获取新旧值
watch(count, (newVal, oldVal) => {
  console.log(`${oldVal} → ${newVal}`);
}, { immediate: true });

// watchEffect: 自动收集依赖，立即执行
watchEffect(() => {
  console.log(count.value);  // 自动追踪 count
  console.log(name.value);   // 自动追踪 name
});

// watch 适合：需要旧值对比、条件触发
// watchEffect 适合：多依赖副作用、代码简洁
```

## Q6: Vue 3 Composition API 的设计动机 [P8]

```javascript
// Options API 的问题：逻辑分散
export default {
  data() { return { count: 0, name: '' } },  // 数据分散
  methods: { increment() {}, updateName() {} },  // 方法分散
  computed: { doubled() {} },  // 计算属性另一处
  watch: { count() {} },  // 监听又在另一处
}

// Composition API：逻辑聚合
function useCounter() {  // 一个功能的逻辑集中在一起
  const count = ref(0);
  const doubled = computed(() => count.value * 2);
  const increment = () => count.value++;
  return { count, doubled, increment };
}

function useName() {
  const name = ref('');
  const updateName = (val) => name.value = val;
  return { name, updateName };
}

// 组合使用
setup() {
  const { count, doubled, increment } = useCounter();
  const { name, updateName } = useName();
  return { count, doubled, increment, name, updateName };
}
```

## Q7: nextTick 原理 [P8]

```javascript
// Vue 3 的 nextTick 使用 Promise.then (微任务)
// 确保在 DOM 更新后执行回调

import { nextTick } from 'vue';

async function updateAndRead() {
  count.value++;  // 修改数据
  // DOM 尚未更新
  
  await nextTick();
  // DOM 已更新，可以安全读取
  console.log(document.querySelector('.count').textContent);
}

// 原理: Vue 将 DOM 更新放入微任务队列
// nextTick 将回调放入同一队列的后面
// 确保 DOM 更新先执行
```
