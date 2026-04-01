# AI 应用面试题

## Q1: 如何设计一个 AI Agent UI？[P9]

**状态机设计**：
```
idle → thinking → planning → executing → observing → responding → done
                                │ tool_calling │
```

**核心要点**：
1. **状态管理**：XState 有限状态机管理 Agent 生命周期
2. **流式通信**：SSE 单向流 / WebSocket 双向交互
3. **渲染策略**：虚拟滚动 + 增量DOM更新 + rAF节流
4. **工具调用UI**：卡片式展示，支持折叠/展开/重试
5. **人机协作**：Human-in-the-loop 确认/修正/中断

## Q2: 如何处理 LLM 流式渲染性能？[P9]

**核心挑战与方案**：

| 挑战 | 方案 |
|------|------|
| 高频DOM更新 | requestAnimationFrame 批量合并 |
| Markdown实时解析 | 增量解析器（只解析新增部分） |
| 代码块高亮 | 延迟高亮（块完成后执行），流式用纯文本 |
| 自动滚动 | CSS `scroll-behavior: smooth` + 底部检测 |
| 长对话性能 | 虚拟滚动 + 对话分页 |
| 主线程阻塞 | Web Worker 处理 Markdown 解析 |

```javascript
// 批量渲染示例
class TokenBatcher {
  buffer = '';
  rafId = null;
  
  push(token) {
    this.buffer += token;
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        this.flush();
        this.rafId = null;
      });
    }
  }
  
  flush() {
    updateDOM(this.buffer);
    this.buffer = '';
  }
}
```

## Q3: 设计企业级 RAG 前端 [P9]

**要点**：
1. **文档上传**：大文件分块上传（Resumable）、进度展示、格式预览
2. **对话界面**：引用标注（行内引用 + 侧边原文）、置信度色彩编码
3. **评估面板**：Recall/Precision/MRR 指标可视化、A/B 对比

## Q4: SSE vs WebSocket vs HTTP Streaming 选型 [P8]

| 协议 | 方向 | 重连 | 适用场景 |
|------|------|------|---------|
| **SSE** | 单向(服务器→客户端) | 自动 | LLM流式输出、通知推送 |
| **WebSocket** | 双向 | 手动 | 实时协作、游戏、双向对话 |
| **HTTP Streaming** | 单向 | 无 | 大文件下载、一次性流式响应 |

**LLM 场景推荐**：
- 基础流式对话 → **SSE**（简单、自动重连）
- 需要中断/发送信号 → **WebSocket**（双向通信）

## Q5: 前端如何做 Token 计数？[P8]

```javascript
// 简单估算（中文约2token/字，英文约1.3token/词）
function estimateTokens(text) {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = text.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(Boolean).length;
  return chineseChars * 2 + Math.ceil(englishWords * 1.3);
}

// 精确计算：使用 tiktoken 的 WASM 版本
import { encoding_for_model } from '@dqbd/tiktoken';
const enc = encoding_for_model('gpt-4');
const tokens = enc.encode(text).length;
enc.free();
```

## Q6: 如何设计 AI-Native 低代码平台？[P10]

**核心模块**：
1. **自然语言生成页面**：用户输入描述 → LLM 生成组件 JSON Schema → 渲染引擎渲染
2. **AI 辅助组件**：智能表单生成、布局自动优化、样式推荐
3. **代码导出**：JSON Schema → React/Vue 源码导出
4. **实时预览**：iframe 沙箱隔离 + postMessage 通信

**技术挑战**：
- LLM 输出的不确定性 → 结构化输出（JSON Mode）+ 校验
- 生成结果质量 → Few-shot Examples + 人工反馈循环
- 组件库兼容性 → Design Token 标准化
