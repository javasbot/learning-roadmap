# 数据架构

## 核心文件

| 文件 | 内容 | 难度 |
|------|------|------|
| [01-State-Management.md](./01-State-Management.md) | 前端状态管理架构 | ⭐⭐⭐⭐ |
| [02-Realtime-Collaboration.md](./02-Realtime-Collaboration.md) | 实时协作系统设计 | ⭐⭐⭐⭐⭐ |

## 状态管理演进

```
2015-2018:           2019-2022:           2023+:
Redux/Vuex          Hooks/Composition     Signals/Queries
全局单一Store       自定义Hook组合        细粒度响应式
├── 样板代码多      ├── 灵活组合          ├── 性能最优
├── DevTools好      ├── 按需引入          ├── 自动追踪依赖
└── 学习成本高      └── 类型推断好        └── 框架趋势

推荐选型:
- 客户端状态: Zustand (React) / Pinia (Vue)
- 服务端状态: TanStack Query (React/Vue)
- 复杂状态机: XState
- 全局简单: Signals (Preact/Solid)
```

## 实时协作核心

| 技术 | 适用场景 |
|------|---------|
| **OT (Operational Transform)** | Google Docs 方案，中心化 |
| **CRDT (Conflict-free Replicated Data Types)** | Figma 方案，去中心化 |
| **Last-Write-Wins** | 简单场景，最后写入覆盖 |
