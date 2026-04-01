# AI Agent 平台项目

## 项目目标
构建一个可视化的 AI Agent 编排和执行平台，支持多 Agent 协作、工具调用可视化。

## 技术栈
- **前端**：React + TypeScript + Zustand
- **后端**：Python (FastAPI) + LangGraph
- **通信**：SSE (Server-Sent Events)
- **可视化**：React Flow (DAG 编排)

## 核心功能

1. **Agent 编排画布**：拖拽式 Agent 工作流设计（基于 React Flow）
2. **流式对话**：Token 级流式渲染 + 思维链展示
3. **Tool Calling 可视化**：卡片式展示工具调用过程和结果
4. **多 Agent 协作**：Parent-Child Agent 模式可视化

## 学习产出
- [ ] 实现 Agent 状态机（idle→thinking→executing→responding）
- [ ] 实现流式渲染引擎（SSE + requestAnimationFrame）
- [ ] 实现 Tool Calling 卡片组件
- [ ] 实现 Agent 编排 DAG 画布
- [ ] 撰写技术演讲 PPT
