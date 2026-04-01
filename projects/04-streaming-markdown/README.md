# 流式 Markdown 渲染器项目

## 项目目标
实现一个高性能的流式 Markdown 渲染器，专门用于 LLM 场景的逐 Token 输入和增量渲染。

## 核心挑战
- 不完整 Markdown 片段的容错解析
- 每个 Token 触发的高频 DOM 更新
- 代码块的实时语法高亮
- 流式表格渲染

## 关键实现

```javascript
class StreamingMarkdownRenderer {
  appendToken(token) {
    this.buffer += token;
    this.scheduleRender();  // requestAnimationFrame 批量更新
  }
  
  scheduleRender() {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.incrementalParse();
      this.incrementalRender();
    });
  }
}
```

## 学习产出
- [ ] 实现增量 Markdown 解析器
- [ ] 实现 requestAnimationFrame 批量渲染
- [ ] 支持代码块高亮（完成后高亮）
- [ ] 支持流式表格渲染
- [ ] 性能测试（1000 token/s 无卡顿）
- [ ] npm 发布
