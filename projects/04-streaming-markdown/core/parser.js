/**
 * 增量 Markdown 分析器 (简版)
 *
 * 核心考点：如果大模型刚刚只吐出了 ```javas 或者 **粗 ，
 * 你的 parser 不能报错，必须能容错等拿到下一截继续解析。
 */

export class StreamingParser {
  constructor() {
    this.buffer = '';      // 累积的所有字符
    this.isInCodeBlock = false; // 状态标记：是否正在打代码快
  }

  // 接收自大模型流回来的 Token
  append(token) {
    this.buffer += token;
    return this._parse(this.buffer);
  }

  _parse(text) {
    let html = '';
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // 匹配代码块的开闭合
      if (line.startsWith('```')) {
        this.isInCodeBlock = !this.isInCodeBlock;
        // 如果是开口
        if (this.isInCodeBlock) {
          const lang = line.replace('```', '').trim();
          html += `<pre><code class="language-${lang}">\n`;
        } else {
          // 如果是闭合口
          html += `</code></pre>\n`;
        }
        continue;
      }

      // 如果当前处在代码块中，不要做任何 markdown 装换，直接转义拼接到 html
      if (this.isInCodeBlock) {
        html += this._escapeHtml(line) + '\n';
        continue;
      }

      // 如果不在代码块中：处理一级标题
      if (line.startsWith('# ')) {
        html += `<h1>${line.substring(2)}</h1>\n`;
        continue;
      }

      // 处理加粗 **文本**
      // 注意：这里为了简化使用正则。真实场景需要实现状态机推断前置光标位置
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // 普通段落
      if (line.trim() !== '') {
        html += `<p>${line}</p>\n`;
      }
    }

    // 容错机制核心：如果你只写了一半的代码块，目前大模型还没吐完，
    // 我们必须在此刻帮它闭合标签！否则整个页面的 DOM 树就崩溃了
    if (this.isInCodeBlock) {
      // 提供一个闪烁光标模拟打字效果
      html += `<span class="typing-cursor">█</span></code></pre>`;
    }

    return html;
  }

  _escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
