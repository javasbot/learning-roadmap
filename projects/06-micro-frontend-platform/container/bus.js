/**
 * 全局状态派发器（EventBus）
 * 面试常考：主子应用如何优雅通信？
 * 解法：不要直接通过 window，而是要自己搭建一张发布订阅（Pub/Sub）网络
 */

class MicroEventBus {
  constructor() {
    this.events = new Map();
    // 共享缓存池，用于首次进入的时候能立即拿到上一个人缓存的状态
    this.sharedState = new Map();
  }

  // 触发（发布）
  emit(eventKey, data) {
    if (this.events.has(eventKey)) {
      this.events.get(eventKey).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[EventBus] ${eventKey} 回调执行异常`);
        }
      });
    }
  }

  // 监听（订阅）
  on(eventKey, callback) {
    const list = this.events.get(eventKey) || [];
    list.push(callback);
    this.events.set(eventKey, list);

    // 如果刚监听的时候发现数据已经被上一个前人存入了状态机，直接立马给他发过去（VueX的精髓）
    if (this.sharedState.has(eventKey)) {
      callback(this.sharedState.get(eventKey));
    }
  }

  // 解绑
  off(eventKey, callback) {
    if (this.events.has(eventKey)) {
      const list = this.events.get(eventKey).filter(cb => cb !== callback);
      this.events.set(eventKey, list);
    }
  }

  // 全局共享池直接设值
  setState(key, val) {
    this.sharedState.set(key, val);
    // 设置完顺手当成事件广播出去
    this.emit(`change:${key}`, val);
  }

  getState(key) {
    return this.sharedState.get(key);
  }
}

// 单例模式暴露出去
export const GlobalBus = new MicroEventBus();
