/**
 * 假想这是一个能在 React/Vue 中调用的极简展示用组件实现逻辑
 * （以 Vanilla JS 形式呈现，方便裸奔理解原理）
 */

export function renderToolVisualizer(containerNode, toolPayload) {
  // 当 Agent 告诉我们进入了 CALLING_TOOL 状态时，前端绝对不能就在那儿傻转圈框！
  // 优质的体验是渲染出一个包含执行动画的卡片：例如 “正在搜索：北京天气...”
  
  const card = document.createElement('div');
  card.className = "tool-card running";
  card.innerHTML = `
    <div class="tool-header">
      <span class="icon">⚙️</span>
      <span class="title">正在执行插件: ${toolPayload.name}</span>
    </div>
    <div class="tool-body">
      <div class="code-block">
        ${JSON.stringify(toolPayload.args || { city: '北京' }, null, 2)}
      </div>
    </div>
    <div class="loader-line"></div>
  `;
  
  // 塞入聊天流中
  containerNode.appendChild(card);
  
  return card;
}

export function updateToolVisualizerToSuccess(cardNode, resultData) {
  // 当工具执行完毕，状态变为 TOOL_RETURNED 甚至 FINAL_RENDER 时
  // 要把刚才转圈圈的卡片，平滑过渡绿色的“执行成功”标记卡片，并收起详细请求体折叠以节省对话面积
  cardNode.classList.remove('running');
  cardNode.classList.add('success');
  
  cardNode.innerHTML = `
    <div class="tool-header success-header">
      <span class="icon">✅</span>
      <span class="title">插件调用完毕</span>
    </div>
    <div class="tool-body collapsable">
      <pre>返回结果: ${resultData}</pre>
    </div>
  `;
}
