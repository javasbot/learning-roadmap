# AI Agent 平台前端架构设计

> **参考来源**：[Anthropic Building Effective Agents](https://docs.anthropic.com/en/docs/build-with-claude/agent)、[AG-UI Protocol](https://docs.ag-ui.com)

## 一、需求分析

设计一个企业级 AI Agent 平台的前端架构，支持：
- 多 Agent 编排与可视化
- 流式对话 + 思维链展示
- Tool Calling 过程可视化
- 知识库管理（RAG）
- 多模态输入（文本 + 图片 + 语音）

## 二、整体架构

```
┌──────────────────────────────────────────────────┐
│                  用户界面层 (UI Layer)              │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ 对话界面  │  │ Agent    │  │ 知识库管理        │ │
│  │ Chat UI  │  │ 编排画布  │  │ Knowledge Base   │ │
│  │ (流式渲染)│  │ (DAG可视化)│  │ (上传/分块/检索) │ │
│  └──────────┘  └──────────┘  └──────────────────┘ │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ 评估面板  │  │ Prompt   │  │ 模型管理         │ │
│  │ Eval      │  │ 管理中心  │  │ Model Hub        │ │
│  │ Dashboard │  │ Templates│  │ (切换/配置/对比)  │ │
│  └──────────┘  └──────────┘  └──────────────────┘ │
├──────────────────────────────────────────────────┤
│              AI 交互层 (AI Interaction Layer)       │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │  流式响应引擎 (Streaming Engine)                │ │
│  │  ├── SSE/WebSocket 连接管理                    │ │
│  │  ├── Token 级流式渲染                          │ │
│  │  ├── Markdown 增量解析 + 代码高亮               │ │
│  │  ├── Tool Calling UI (卡片式可视化)             │ │
│  │  └── 背压控制 (Backpressure)                   │ │
│  └──────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────┤
│              状态管理层 (State Layer)                │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │  Agent 状态机 (Finite State Machine)           │ │
│  │                                                │ │
│  │  idle → thinking → planning → executing        │ │
│  │    ↑      │          │          │              │ │
│  │    │      ▼          ▼          ▼              │ │
│  │    │  tool_calling  observing  responding       │ │
│  │    │      │          │          │              │ │
│  │    └──────┴──────────┴──────────┘              │ │
│  │                                                │ │
│  │  对话历史管理 | 多轮上下文 | Token 计数          │ │
│  │  会话持久化 | 离线缓存 | 乐观更新              │ │
│  └──────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────┤
│              基础设施层 (Infrastructure)             │
│                                                    │
│  错误恢复 | 重试策略 | AbortController             │
│  Token 用量统计 | 协同编辑 | 权限管理               │
│  性能优化 | 虚拟滚动 | Web Worker                   │
└──────────────────────────────────────────────────┘
```

## 三、核心实现

### 3.1 流式渲染引擎

```typescript
// 流式渲染引擎核心实现
class StreamingEngine {
  private buffer = '';
  private parser: IncrementalMarkdownParser;
  private renderFrame: number | null = null;
  private abortController: AbortController | null = null;
  
  constructor(
    private container: HTMLElement,
    private onStateChange: (state: AgentState) => void
  ) {
    this.parser = new IncrementalMarkdownParser();
  }
  
  async connect(url: string, payload: ChatRequest): Promise<void> {
    this.abortController = new AbortController();
    this.onStateChange('connecting');
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: this.abortController.signal,
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.body) throw new Error('No response body');
      
      this.onStateChange('streaming');
      await this.processStream(response.body);
      this.onStateChange('done');
      
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        this.onStateChange('cancelled');
      } else {
        this.onStateChange('error');
        throw error;
      }
    }
  }
  
  private async processStream(body: ReadableStream<Uint8Array>): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value, { stream: true });
        this.processSSEData(text);
      }
    } finally {
      reader.releaseLock();
      this.flushRender();
    }
  }
  
  private processSSEData(raw: string): void {
    // SSE 数据解析
    const lines = raw.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        
        try {
          const event = JSON.parse(data);
          this.handleEvent(event);
        } catch (e) {
          // 非 JSON 数据，作为纯文本 token 处理
          this.appendToken(data);
        }
      }
    }
  }
  
  private handleEvent(event: StreamEvent): void {
    switch (event.type) {
      case 'text_delta':
        this.appendToken(event.content);
        break;
      case 'tool_call_start':
        this.onStateChange('tool_calling');
        this.renderToolCallStart(event);
        break;
      case 'tool_call_result':
        this.renderToolCallResult(event);
        break;
      case 'thinking':
        this.onStateChange('thinking');
        this.renderThinking(event.content);
        break;
    }
  }
  
  private appendToken(token: string): void {
    this.buffer += token;
    this.scheduleRender();
  }
  
  private scheduleRender(): void {
    if (this.renderFrame) return;
    this.renderFrame = requestAnimationFrame(() => {
      this.renderFrame = null;
      this.render();
    });
  }
  
  private render(): void {
    // 增量解析 Markdown
    const html = this.parser.parseIncremental(this.buffer);
    
    // 最小化 DOM 更新
    this.updateDOM(html);
    
    // 自动滚动
    this.autoScroll();
  }
  
  private autoScroll(): void {
    const { scrollHeight, clientHeight, scrollTop } = this.container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    if (isNearBottom) {
      this.container.scrollTo({
        top: scrollHeight,
        behavior: 'smooth'
      });
    }
  }
  
  // 停止生成
  abort(): void {
    this.abortController?.abort();
  }
}
```

### 3.2 Agent 状态机

```typescript
// 使用有限状态机管理 Agent 状态
type AgentState = 
  | 'idle'
  | 'connecting'
  | 'thinking'
  | 'planning'
  | 'streaming'
  | 'tool_calling'
  | 'observing'
  | 'done'
  | 'error'
  | 'cancelled';

interface AgentStateConfig {
  [state: string]: {
    ui: {
      indicator: string;  // 状态指示器
      actions: string[];  // 可用操作
      animation: string;  // 动画类型
    };
    transitions: AgentState[];  // 允许的状态转换
  };
}

const stateConfig: AgentStateConfig = {
  idle: {
    ui: { indicator: '', actions: ['send'], animation: 'none' },
    transitions: ['connecting']
  },
  connecting: {
    ui: { indicator: '连接中...', actions: ['cancel'], animation: 'pulse' },
    transitions: ['thinking', 'streaming', 'error']
  },
  thinking: {
    ui: { indicator: '思考中...', actions: ['cancel'], animation: 'dots' },
    transitions: ['planning', 'streaming', 'tool_calling', 'error']
  },
  planning: {
    ui: { indicator: '规划中...', actions: ['cancel'], animation: 'dots' },
    transitions: ['tool_calling', 'streaming', 'error']
  },
  tool_calling: {
    ui: { indicator: '调用工具...', actions: ['cancel'], animation: 'spin' },
    transitions: ['observing', 'streaming', 'error']
  },
  observing: {
    ui: { indicator: '分析结果...', actions: ['cancel'], animation: 'dots' },
    transitions: ['thinking', 'streaming', 'tool_calling', 'error']
  },
  streaming: {
    ui: { indicator: '', actions: ['stop'], animation: 'cursor' },
    transitions: ['done', 'tool_calling', 'error', 'cancelled']
  },
  done: {
    ui: { indicator: '', actions: ['regenerate', 'send'], animation: 'none' },
    transitions: ['connecting']
  },
  error: {
    ui: { indicator: '出错了', actions: ['retry', 'send'], animation: 'none' },
    transitions: ['connecting']
  },
  cancelled: {
    ui: { indicator: '已停止', actions: ['continue', 'send'], animation: 'none' },
    transitions: ['connecting']
  }
};
```

### 3.3 Tool Calling 可视化

```typescript
// Tool 调用卡片组件设计
interface ToolCall {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  input: Record<string, any>;
  output?: any;
  duration?: number;
  startTime: number;
}

// 渲染不同工具的结果
const ToolResultRenderers: Record<string, (result: any) => string> = {
  'web_search': (result) => `
    <div class="tool-result search-result">
      <h4>搜索结果 (${result.results.length}条)</h4>
      ${result.results.map((r: any) => `
        <div class="search-item">
          <a href="${r.url}">${r.title}</a>
          <p>${r.snippet}</p>
        </div>
      `).join('')}
    </div>
  `,
  
  'code_execution': (result) => `
    <div class="tool-result code-result">
      <pre><code>${result.output}</code></pre>
      ${result.error ? `<div class="error">${result.error}</div>` : ''}
    </div>
  `,
  
  'image_generation': (result) => `
    <div class="tool-result image-result">
      <img src="${result.url}" alt="${result.description}" loading="lazy" />
    </div>
  `,
};
```

### 3.4 对话历史与 Token 管理

```typescript
class ConversationManager {
  private messages: Message[] = [];
  private maxTokens: number;
  private tokenCounter: TokenCounter;
  
  constructor(modelConfig: { maxContextLength: number }) {
    this.maxTokens = modelConfig.maxContextLength;
    this.tokenCounter = new TokenCounter();
  }
  
  addMessage(message: Message): void {
    this.messages.push(message);
    this.maybeCompressHistory();
  }
  
  // Token 窗口管理
  private maybeCompressHistory(): void {
    const totalTokens = this.tokenCounter.count(this.messages);
    
    if (totalTokens > this.maxTokens * 0.8) {
      // 策略1: 滑动窗口 - 保留最近的消息
      // 策略2: 摘要压缩 - 将早期消息压缩为摘要
      this.compressEarlyMessages();
    }
  }
  
  private async compressEarlyMessages(): Promise<void> {
    const keepRecent = 10;  // 保留最近10条完整消息
    
    if (this.messages.length <= keepRecent) return;
    
    const earlyMessages = this.messages.slice(0, -keepRecent);
    const recentMessages = this.messages.slice(-keepRecent);
    
    // 调用 LLM 生成摘要
    const summary = await this.generateSummary(earlyMessages);
    
    this.messages = [
      { role: 'system', content: `[对话历史摘要]: ${summary}` },
      ...recentMessages
    ];
  }
  
  // 持久化到 IndexedDB
  async persist(sessionId: string): Promise<void> {
    const db = await openDB('agent-platform', 1);
    await db.put('conversations', {
      id: sessionId,
      messages: this.messages,
      updatedAt: Date.now()
    });
  }
}
```

## 四、性能优化

### 长对话性能

```typescript
// 虚拟滚动 + 对话分页
class VirtualChatList {
  private visibleRange = { start: 0, end: 20 };
  private messageHeights: Map<string, number> = new Map();
  
  // 使用 IntersectionObserver 实现懒加载
  private observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 加载更多历史消息
        this.loadMoreHistory();
      }
    });
  });
  
  // 只渲染可见区域的消息
  getVisibleMessages(): Message[] {
    return this.messages.slice(
      this.visibleRange.start,
      this.visibleRange.end
    );
  }
}
```

## 五、面试作答框架

1. **需求分析**：Agent 状态多样性、流式渲染挑战、多Tool并发
2. **架构分层**：UI层 → AI交互层 → 状态管理层 → 基础设施层
3. **流式渲染**：SSE + requestAnimationFrame批量更新 + 增量Markdown解析
4. **状态管理**：有限状态机管理Agent生命周期
5. **性能方案**：虚拟滚动 + Web Worker解析 + CSS contain隔离
6. **容错设计**：AbortController中断 + 重试策略 + 离线缓存
