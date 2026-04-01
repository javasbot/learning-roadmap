import { StreamingParser } from './parser.js';

/**
 * 核心渲染器，解决页面卡屏问题
 *
 * 如果大模型 1 秒钟内返回了 50 个 Token。
 * 如果你每个 Token 来的时候都去 `container.innerHTML = html`，
 * 那么 1 秒内浏览器渲染引擎会被强制打断发生 50 次重排和重绘 (Reflow & Repaint)，设备立刻掉帧卡死。
 */
export class StreamingRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.parser = new StreamingParser();
    this.rafId = null;  // 保存 requestAnimationFrame 的句柄
    this.pendingHtml = ''; // 暂存将要渲染的内容
  }

  // 组件/工具暴露的接收大模型返回值的方法
  receiveToken(token) {
    // 1. 解析增量文本
    this.pendingHtml = this.parser.append(token);
    
    // 2. 调度渲染 (这是防止卡死的关键！)
    this.scheduleRender();
  }

  scheduleRender() {
    // 如果已经有一个帧准备去渲染了，就不要再派生新的帧
    // 这就把 1秒/50次的更新，强行“打批”成 1秒/最多60次 (显示器刷新率) 且只在浏览器绝对空闲的一瞬间插入
    if (this.rafId) {
      return; 
    }

    this.rafId = requestAnimationFrame(() => {
      // 清空调度锁
      this.rafId = null;
      
      // 执行真实的 DOM 写入
      // 注：此处为了方便利用了 innerHTML 覆盖。
      // 在要求极致的工业级应用（如 ChatGPT 官网），不能用 innerHTML，而是遍历比较差异，或者使用 DocumentFragment 定点末尾追加 TextNode
      this.container.innerHTML = this.pendingHtml;
      
      // 发送由于打批错过的一些高亮代码格式化信令等...
      this.onRendered();
    });
  }

  onRendered() {
    // 这里可以触发 highlight.js 的高亮处理。
    // 将滚动条锁定到最底部
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }
}
