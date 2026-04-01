# Vue3 深度解析

> **权威来源**：[Vue.js 设计与实现 - 霍春阳](https://book.douban.com/subject/35768338/)、[Vue3 源码](https://github.com/vuejs/core)

## 核心文件

| 文件 | 内容 | 难度 |
|------|------|------|
| [01-Reactivity-System.md](./01-Reactivity-System.md) | Proxy 响应式系统 | ⭐⭐⭐⭐⭐ |
| [02-Compiler-Optimization.md](./02-Compiler-Optimization.md) | 编译时优化策略 | ⭐⭐⭐⭐⭐ |
| [03-Composition-API.md](./03-Composition-API.md) | Composition API 设计 | ⭐⭐⭐⭐ |

## 架构总览

```
Vue 3 架构:

┌─────────────────────────────────────────┐
│           @vue/compiler-dom              │
│  Template → AST → Transform → CodeGen   │
│  静态提升 / Patch Flags / Block Tree     │
├─────────────────────────────────────────┤
│           @vue/runtime-dom               │
│  DOM 操作 / 事件处理 / 属性更新          │
├─────────────────────────────────────────┤
│           @vue/runtime-core              │
│  组件系统 / VNode / Diff / Scheduler    │
├─────────────────────────────────────────┤
│           @vue/reactivity                │
│  reactive / ref / computed / effect      │
│  track / trigger / Proxy                 │
└─────────────────────────────────────────┘
```

## Vue3 vs Vue2 核心提升

| 维度 | Vue 2 | Vue 3 |
|------|-------|-------|
| 响应式 | Object.defineProperty（有限） | Proxy（全覆盖） |
| 编译 | 运行时 Diff | 编译时优化（PatchFlags） |
| API | Options（逻辑分散） | Composition（逻辑聚合） |
| 性能 | 全量 VNode Diff | 只 Diff 动态节点 |
| TypeScript | 弱支持 | 一等公民 |
| Tree-shaking | 不支持 | 全面支持 |
