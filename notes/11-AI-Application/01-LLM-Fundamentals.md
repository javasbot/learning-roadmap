# LLM 基础原理

> **权威来源**：[Attention Is All You Need](https://arxiv.org/abs/1706.03762)、[Andrej Karpathy 课程](https://karpathy.ai)

## 一、Transformer 架构

```
Input Tokens
    │
    ▼
┌─────────────────┐
│  Token Embedding │ + Positional Encoding
└────────┬────────┘
         │
    ┌────▼────┐ × N layers
    │ Encoder │ (BERT等)  /  Decoder (GPT等)
    │ Block   │
    │ ┌─────┐ │
    │ │Multi │ │ ← 多头自注意力
    │ │Head  │ │
    │ │Attn  │ │
    │ └──┬──┘ │
    │    ▼    │
    │ Add&Norm│ ← 残差连接 + LayerNorm
    │    ▼    │
    │ ┌─────┐ │
    │ │ FFN  │ │ ← 前馈神经网络
    │ └──┬──┘ │
    │    ▼    │
    │ Add&Norm│
    └────┬────┘
         │
    ┌────▼────┐
    │  Linear  │ → Softmax → 输出概率分布
    └─────────┘
```

## 二、注意力机制

```
Attention(Q, K, V) = softmax(QK^T / √d_k) × V

Q = 查询（当前token想问什么）
K = 键（每个token能提供什么信息）
V = 值（实际的信息内容）
√d_k = 缩放因子（防止点积过大）

直觉：每个token关注所有其他token，
      计算与它们的"相关度"加权求和
```

**多头注意力**：将 Q/K/V 拆成多个头，并行计算注意力，最后拼接。不同头可以关注不同的语言模式（语法、语义、位置等）。

## 三、Tokenization

```
文本: "Hello, world! 你好世界"

BPE (Byte Pair Encoding) 分词:
→ ["Hello", ",", " world", "!", " ", "你", "好", "世", "界"]
→ Token IDs: [15496, 11, 995, 0, 220, 38948, 170, 10236, 22618]

特点:
- 常用词 → 单个token
- 罕见词 → 拆成子词
- 中文通常 1字 = 1-2 tokens
- GPT-4: ~4字符 ≈ 1 token
```

## 四、Prompt Engineering

### 关键技术

```
1. Zero-shot:    直接提问
2. Few-shot:     给出示例后提问
3. Chain-of-Thought (CoT): "请一步一步思考"
4. Tree-of-Thought (ToT):  探索多条推理路径
5. ReAct:        推理 + 行动交替
6. Self-consistency: 多次采样取多数答案
```

### 结构化输出

```javascript
// 使用 JSON Mode 获取结构化输出
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  response_format: { type: 'json_object' },
  messages: [{
    role: 'system',
    content: `你是一个数据提取助手。请将用户输入提取为以下JSON格式:
    { "name": string, "age": number, "skills": string[] }`
  }, {
    role: 'user',
    content: '张三，28岁，精通React和Node.js'
  }]
});
// → { "name": "张三", "age": 28, "skills": ["React", "Node.js"] }
```

## 五、前端开发者需要了解的 LLM 概念

| 概念 | 对前端的影响 |
|------|-------------|
| **Token 限制** | 前端需做 Token 计数和历史压缩 |
| **流式输出** | 需要 SSE/WebSocket 接收和增量渲染 |
| **温度(Temperature)** | 影响输出随机性，需提供 UI 调节 |
| **Function Calling** | 前端需渲染工具调用过程和结果 |
| **多模态** | 需处理图片/音频的上传和预览 |
| **Rate Limiting** | 需做客户端限流和排队策略 |
| **Model 选择** | 需提供模型切换 UI |
