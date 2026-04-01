# 微前端架构设计

> **参考来源**：[micro-frontends.org](https://micro-frontends.org)、[Module Federation 文档](https://module-federation.io)

## 一、技术选型对比

| 方案 | 原理 | 优势 | 劣势 |
|------|------|------|------|
| **iframe** | 天然隔离 | 最强隔离 | 性能差、通信复杂、SEO差 |
| **qiankun** | single-spa + Proxy沙箱 | 生态成熟、社区活跃 | 沙箱非完全隔离 |
| **Module Federation** | Webpack/Rspack 原生 | 共享依赖、构建集成 | 版本管理复杂 |
| **Wujie** | iframe + WebComponent | 强隔离、保持路由 | 方案较新 |
| **ShadowRealm** | TC39提案 | 原生隔离 | 浏览器支持待定 |

## 二、整体架构（100+子应用）

```
┌──────────────────────────────────────┐
│           主应用 (Container)          │
│  ┌──────┐ ┌────────┐ ┌───────────┐  │
│  │ 导航  │ │全局状态 │ │ 应用注册表 │  │
│  │ 路由  │ │ 通信总线│ │ (远程配置) │  │
│  └──────┘ └────────┘ └───────────┘  │
├──────────────────────────────────────┤
│          子应用挂载区域               │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │App A │ │App B │ │App C │ ...    │
│  │React │ │Vue 3 │ │Svelte│        │
│  └──────┘ └──────┘ └──────┘        │
├──────────────────────────────────────┤
│           共享层                      │
│  Design System │ 公共工具 │ 监控SDK  │
└──────────────────────────────────────┘
```

## 三、核心设计

### 3.1 应用注册与发现

```javascript
// 远程应用注册表（从配置中心获取）
const appRegistry = {
  dashboard: {
    name: 'dashboard',
    entry: 'https://cdn.example.com/dashboard/remoteEntry.js',
    activeRule: '/dashboard',
    container: '#micro-app',
  },
  orders: {
    name: 'orders',
    entry: 'https://cdn.example.com/orders/remoteEntry.js',
    activeRule: '/orders',
    container: '#micro-app',
  }
};
```

### 3.2 JS 沙箱

```javascript
class ProxySandbox {
  active = false;
  fakeWindow = Object.create(null);
  
  constructor(name) {
    this.name = name;
    this.proxy = new Proxy(this.fakeWindow, {
      get: (target, key) => {
        // 优先从沙箱取，不存在则取全局
        return key in target ? target[key] : window[key];
      },
      set: (target, key, value) => {
        if (this.active) { target[key] = value; }
        return true;
      },
      has: (target, key) => key in target || key in window,
    });
  }
  
  activate() { this.active = true; }
  deactivate() { this.active = false; }
}
```

### 3.3 CSS 隔离

```css
/* 1. Shadow DOM — 最强隔离 */
/* 2. CSS Modules — 哈希类名 */
/* 3. 命名空间 */
.app-orders .btn { /* 通过父级限定 */ }

/* 4. @scope (新标准) */
@scope (.app-orders) to (.third-party) {
  .btn { background: blue; }  /* 只在范围内生效 */
}
```

### 3.4 应用间通信

```javascript
// 发布订阅通信总线
class MicroAppBus {
  events = new Map();
  sharedState = new Map();
  
  // 事件通信
  emit(event, data) { this.events.get(event)?.forEach(fn => fn(data)); }
  on(event, fn) { (this.events.get(event) || this.events.set(event, []).get(event)).push(fn); }
  
  // 共享状态
  setState(key, value) { this.sharedState.set(key, value); this.emit(`state:${key}`, value); }
  getState(key) { return this.sharedState.get(key); }
}

// 挂载到全局
window.__MICRO_APP_BUS__ = new MicroAppBus();
```

## 四、面试回答框架

1. **为什么微前端**：业务拆分、技术栈异构、独立部署、团队自治
2. **方案选型**：对比 iframe/qiankun/MF/Wujie 的优劣
3. **沙箱方案**：JS 沙箱(Proxy) + CSS 隔离(Shadow DOM/Scoped)
4. **通信机制**：EventBus + 共享状态 + URL 参数
5. **性能优化**：预加载、共享依赖、按需加载
6. **部署策略**：独立 CI/CD、版本管理、灰度发布
