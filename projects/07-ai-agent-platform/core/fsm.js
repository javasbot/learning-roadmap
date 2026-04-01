/**
 * AI Agent 核心状态机 (Finite State Machine)
 * 区别于普通的大模型一问一答，Agent 具有“使用工具”和“反思计算”的能力。
 * 这意味着它在生成答案之前，可能会经历极长和极其复杂的生命周期跳跃。我们需要一个严格的状态机管线（Pipeline）。
 */

// Agent 所有可能存在的状态节点
export const AgentState = {
  IDLE: 'IDLE',                       // 待机状态
  THINKING: 'THINKING',               // 发送请求，等待模型首次流回
  ANALYZING_INTENT: 'ANALYZING_INTENT', // 解析用户的真实意图，看是否需要调用插件工具
  CALLING_TOOL: 'CALLING_TOOL',       // 【核心】意图解析后模型发出了指令，前端正在代为执行某网络请求工具
  TOOL_RETURNED: 'TOOL_RETURNED',     // 前端执行完工具，拿到了类似“北京气温20度”的数据，准备回传给模型
  GENERATING_RESPONSE: 'GENERATING_RESPONSE', // 大模型拿到全部前置条件，开始疯狂打字吐出 Markdown
  FINISHED: 'FINISHED',               // 一次交互结束
  ERROR: 'ERROR'                      // 中断或者报错
};

export class AgentFSM {
  constructor(onStateChange, onToolCallReq) {
    this.currentState = AgentState.IDLE;
    this.onStateChange = onStateChange; // 回掉钩子，用来推给 React UI 渲染 "思考中..." 或者 "执行中..." 的 Card
    this.onToolCallReq = onToolCallReq; // 工具派发枢纽
  }

  transition(newState, payload = null) {
    console.log(`[Agent FSM] 状态跃迁: ${this.currentState} -> ${newState}`);
    this.currentState = newState;
    
    // 如果存在 React UI 监听，立即派发更新让页面有过渡动画
    if (this.onStateChange) {
      this.onStateChange(this.currentState, payload);
    }
  }

  // ==== 以下是模拟一次真实验证流 ====
  async handleUserInput(userText) {
    try {
      // 1. 发起请求
      this.transition(AgentState.THINKING);
      
      // 模拟网络延迟
      await this.sleep(800);
      
      // 2. 根据大模型返回的标识，他可能说他需要查天气。
      this.transition(AgentState.ANALYZING_INTENT);
      const isNeedTool = userText.includes("天气"); // 假定触发条件
      
      if (isNeedTool) {
        // 模型发出了 function_call: { name: 'get_weather', args: { city: '北京' } }
        this.transition(AgentState.CALLING_TOOL, { name: '获取天气信息', city: '北京' });
        
        // 阻塞式的执行真实物理机器/浏览器上的 JS 函数去拿天气
        const toolResult = await this.onToolCallReq('get_weather', '北京');
        
        // 拿到数据
        this.transition(AgentState.TOOL_RETURNED, toolResult);
        await this.sleep(500); // 模拟模型重新思考时间
      }

      // 3. 进入疯狂生成文字流环节 (对接刚才上一课做的流式 markdown 渲染器)
      this.transition(AgentState.GENERATING_RESPONSE);
      await this.sleep(2000); 

      // 4. 彻底结束
      this.transition(AgentState.FINISHED);

    } catch (e) {
      this.transition(AgentState.ERROR, e.message);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
