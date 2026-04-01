# React 深度解析

> **权威来源**：[React 官方文档](https://react.dev)、[React 源码](https://github.com/facebook/react)

## 模块概览

React 是目前最主流的前端框架之一。P10 级别要求不仅会使用 React，更要深入理解其内部架构原理，能够设计框架级性能优化方案。

## 核心文件

| 文件 | 内容 | 难度 |
|------|------|------|
| [01-Fiber-Architecture.md](./01-Fiber-Architecture.md) | Fiber 架构设计原理 | ⭐⭐⭐⭐⭐ |
| [02-Reconciler-Diff.md](./02-Reconciler-Diff.md) | Reconciler 与 Diff 算法 | ⭐⭐⭐⭐⭐ |
| [03-Hooks-Internals.md](./03-Hooks-Internals.md) | Hooks 内部实现原理 | ⭐⭐⭐⭐ |
| [04-Concurrent-Mode.md](./04-Concurrent-Mode.md) | 并发模式与调度器 | ⭐⭐⭐⭐⭐ |
| [05-React-Compiler.md](./05-React-Compiler.md) | React Compiler 编译时优化 | ⭐⭐⭐⭐ |

## 核心架构图

```
React 架构分层:

┌─────────────────────────────────────────┐
│             React API Layer              │
│  createElement / JSX / Hooks / Component │
├─────────────────────────────────────────┤
│             Reconciler                   │
│  Fiber 树构建 / Diff算法 / 副作用收集     │
├─────────────────────────────────────────┤
│             Scheduler                    │
│  优先级调度 / 时间切片 / 任务中断/恢复    │
├─────────────────────────────────────────┤
│             Renderer                     │
│  ReactDOM / React Native / React Three   │
└─────────────────────────────────────────┘
```

## React 18+ 核心变更

| 特性 | 描述 |
|------|------|
| **Concurrent Rendering** | 可中断渲染，优先响应用户交互 |
| **Automatic Batching** | 自动批量更新（包括 setTimeout、Promise 中） |
| **useTransition** | 标记非紧急更新，保持界面响应 |
| **useDeferredValue** | 延迟更新非关键 UI |
| **Suspense + SSR Streaming** | 流式服务端渲染 |
| **React Server Components** | 服务端组件，零客户端 JS |
| **React Compiler (v19+)** | 编译时自动优化，取代手动 memo |
