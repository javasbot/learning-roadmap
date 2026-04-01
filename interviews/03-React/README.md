# React 面试题

## Q1: React Fiber 的作用？[P8]

**答**：Fiber 将渲染工作拆分为可中断的工作单元，解决了 React 15 Stack Reconciler 同步递归渲染导致的长时间主线程阻塞问题。核心特性：
1. **可中断渲染**：通过链表结构（child/sibling/return）实现
2. **优先级调度**：高优先级更新（用户交互）可打断低优先级更新
3. **双缓冲**：current 树和 workInProgress 树交替，无闪烁更新

## Q2: useEffect 和 useLayoutEffect 区别？[P7]

| 特性 | useEffect | useLayoutEffect |
|------|-----------|-----------------|
| 执行时机 | Paint **之后**异步执行 | Paint **之前**同步执行 |
| 阻塞渲染 | ❌ | ✅ |
| 使用场景 | 数据获取、订阅、日志 | DOM测量、同步DOM修改 |

```javascript
// useLayoutEffect 使用场景：避免闪烁
function Tooltip({ position }) {
  const ref = useRef();
  useLayoutEffect(() => {
    // 必须在渲染前计算位置，避免闪烁
    const rect = ref.current.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      ref.current.style.left = `${window.innerWidth - rect.width}px`;
    }
  }, [position]);
  return <div ref={ref}>...</div>;
}
```

## Q3: React 18 并发特性 [P8]

**useTransition**：标记非紧急更新
```javascript
function SearchPage() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setQuery(e.target.value);         // 紧急：立即更新输入框
    startTransition(() => {
      setSearchResults(e.target.value); // 非紧急：可延迟
    });
  };

  return <>
    <input value={query} onChange={handleChange} />
    {isPending ? <Spinner /> : <Results />}
  </>;
}
```

## Q4: React 状态更新是同步还是异步？[P8]

**React 18+**：所有更新默认批量处理（Automatic Batching）
```javascript
// React 18 之前
setTimeout(() => {
  setCount(1);  // 触发一次渲染
  setFlag(true); // 触发又一次渲染（共2次）
}, 0);

// React 18 之后
setTimeout(() => {
  setCount(1);   // 不立即渲染
  setFlag(true); // 不立即渲染
  // 批量处理，只渲染1次
}, 0);

// 如需同步：使用 flushSync
import { flushSync } from 'react-dom';
flushSync(() => setCount(1));  // 立即渲染
```

## Q5: React Diff 算法 [P9]

**三个假设**：
1. 不同类型元素 → 销毁重建
2. 同级元素通过 key 区分
3. 时间复杂度 O(n)

**key 的重要性**：
```javascript
// ❌ 用 index 作 key（列表插入/删除时状态错乱）
items.map((item, index) => <Item key={index} />)

// ✅ 用唯一 id 作 key
items.map(item => <Item key={item.id} />)
```

## Q6: React Server Components [P9]

**核心概念**：
- **Server Component**：运行在服务端，0 客户端 JS，可直接访问数据库
- **Client Component**：运行在客户端，有交互能力
- **规则**：Server Component 不能使用 useState/useEffect，但可以 import Client Component

```
// 决策矩阵
需要交互/state → Client Component ('use client')
只是展示数据 → Server Component (默认)
需要访问数据库 → Server Component
需要浏览器API → Client Component
```

## Q7: useMemo 和 useCallback 何时使用？[P8]

**答**：React Compiler（19+）自动处理 memo 优化后，手动使用场景显著减少。

**仍需手动的场景**：
1. 传递给 `React.memo` 包裹的子组件的引用类型 props
2. useEffect 的复杂依赖项
3. 计算成本极高的派生数据

```javascript
// React 19+ 不再需要手动 memo
// React Compiler 会自动分析并插入 memo
function TodoList({ todos }) {
  // Compiler 自动优化，无需 useMemo
  const filtered = todos.filter(t => t.active);
  return filtered.map(t => <Todo key={t.id} todo={t} />);
}
```

## Q8: 如何手写 Mini React？[P10]

**核心步骤**（详见 projects/01-mini-react）：
1. `createElement` — 创建 Virtual DOM
2. `Fiber 节点` — 链表结构定义
3. `workLoop` — requestIdleCallback 调度循环
4. `performUnitOfWork` — 执行单个工作单元（beginWork + completeWork）
5. `reconcileChildren` — Diff 算法（key 比较 + effectTag）
6. `commitRoot` — 提交 DOM 变更
7. `useState` — Hooks 实现（hooks 链表 + 更新队列）
