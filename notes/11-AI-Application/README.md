# AI 应用开发

> **权威来源**：[Anthropic Docs](https://docs.anthropic.com)、[OpenAI Cookbook](https://cookbook.openai.com)、[LangChain](https://python.langchain.com)

## 核心文件

| 文件 | 内容 | 难度 |
|------|------|------|
| [01-LLM-Fundamentals.md](./01-LLM-Fundamentals.md) | LLM 原理：Transformer、注意力机制、推理 | ⭐⭐⭐⭐ |
| [02-RAG-System.md](./02-RAG-System.md) | RAG 系统设计与实现 | ⭐⭐⭐⭐ |
| [03-Agent-Architecture.md](./03-Agent-Architecture.md) | Agent 架构：ReAct、Plan-Execute、Multi-Agent | ⭐⭐⭐⭐⭐ |
| [04-Streaming-UI.md](./04-Streaming-UI.md) | 流式 UI 渲染技术 | ⭐⭐⭐⭐ |

## 知识导图

```
AI 应用开发
├── LLM 基础
│   ├── Transformer 架构
│   ├── Attention 机制（Self/Multi-Head/Cross）
│   ├── Tokenization（BPE/WordPiece）
│   ├── 推理优化（KV Cache/量化/蒸馏）
│   └── Prompt Engineering（Few-shot/CoT/ToT）
├── RAG（检索增强生成）
│   ├── 文档处理 Pipeline（分块/Embedding/存储）
│   ├── 检索策略（向量检索/关键词/混合检索）
│   ├── 向量数据库（Pinecone/Chroma/Milvus）
│   ├── 重排序（Reranking）
│   └── 评估指标（Recall/Precision/MRR/RAGAS）
├── Agent 系统
│   ├── ReAct 模式（推理+行动）
│   ├── Plan-and-Execute（规划执行）
│   ├── Multi-Agent 协作
│   ├── Tool Calling / Function Calling
│   ├── Memory 系统（短期/长期/向量检索）
│   └── 协议（MCP/AG-UI/A2A）
└── 前端 AI 架构
    ├── 流式渲染（SSE/WebSocket）
    ├── Generative UI
    ├── Agent UI 设计模式
    └── 多模态交互（文本+图片+语音）
```
