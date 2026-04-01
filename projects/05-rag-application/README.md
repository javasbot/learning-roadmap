# 企业级 RAG 应用项目

## 项目目标
构建一个完整的 RAG（Retrieval-Augmented Generation）知识库应用，包含文档管理、智能问答、引用溯源。

## 技术栈
- **前端**：React + TypeScript + TailwindCSS
- **后端**：Python (FastAPI) / Node.js
- **LLM**：OpenAI API / Claude API
- **向量数据库**：Chroma / Pinecone
- **Embedding**：OpenAI text-embedding-3-small

## 核心功能

### 1. 文档处理 Pipeline
```
文档上传 → 格式解析(PDF/Word/MD) → 文本分块(Chunking)
→ Embedding 生成 → 向量存储 → 索引构建
```

### 2. 检索与生成
```
用户提问 → Query Embedding → 向量检索(Top-K)
→ Reranking → Context 组装 → LLM 生成 → 流式响应
→ 引用标注(Citation)
```

### 3. 前端界面
- 文档上传管理（拖拽上传、进度展示、格式预览）
- 对话界面（流式输出、引用高亮、代码渲染）
- 管理后台（检索效果评估、Prompt 调优）

## 学习产出
- [ ] 完成文档处理 Pipeline（支持 PDF/MD/TXT）
- [ ] 实现向量检索 + Reranking
- [ ] 实现流式对话 + 引用展示
- [ ] 完成评估 Dashboard（Recall/Precision指标）
- [ ] 撰写架构设计文档
- [ ] GitHub 开源
