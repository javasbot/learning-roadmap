# 工程化面试题

## Q1: Webpack vs Vite 的本质区别？[P7]

| 特性 | Webpack | Vite |
|------|---------|------|
| 开发模式 | 打包后启动 | **原生 ESM**（按需编译）|
| 启动速度 | 慢（全量构建） | **极快**（秒级） |
| HMR 速度 | 随项目变大变慢 | **恒定快速** |
| 生产构建 | Webpack 自身 | **Rollup** |
| 配置复杂度 | 高 | 低（约定 > 配置） |
| 扩展性 | Loader + Plugin | 兼容 Rollup 插件 |

**Vite 快的原因**：
1. 利用浏览器原生 ESM，不预打包
2. 使用 esbuild 预构建依赖（比JS工具快100x）
3. HMR 只更新变化模块，不重新构建依赖图

## Q2: Monorepo 治理方案？[P8]

```
推荐工具对比:
├── Turborepo: 任务调度 + 远程缓存（推荐）
├── Nx: 功能全面、依赖图分析
├── pnpm workspace: 包管理层（配合Turbo使用）
└── Lerna: 旧方案（不推荐新项目）

Monorepo 结构:
my-app/
├── apps/
│   ├── web/         # 主应用
│   ├── admin/       # 管理后台
│   └── mobile/      # 移动端
├── packages/
│   ├── ui/          # 共享组件库
│   ├── utils/       # 工具库
│   ├── config/      # 共享配置
│   └── types/       # TypeScript 类型
├── turbo.json       # Turborepo 配置
├── pnpm-workspace.yaml
└── package.json
```

## Q3: CI/CD Pipeline 设计？[P8]

```
代码提交
  │
  ▼
┌─────────────┐
│ Pre-commit   │ → Lint (ESLint) + Format (Prettier) + Type Check
└──────┬──────┘
       ▼
┌─────────────┐
│ CI Pipeline  │ → Install → Build → Test → Lint → Bundle Size Check
└──────┬──────┘
       ▼
┌─────────────┐
│ Code Review  │ → PR Review + Auto Preview Deployment
└──────┬──────┘
       ▼
┌─────────────┐
│ CD Pipeline  │ → Build → Upload CDN → Canary(1%) → Gray(10%) → Full
└──────┬──────┘
       ▼
┌─────────────┐
│ Monitoring   │ → 错误率 / 性能指标 / 用户反馈 → 自动回滚
└─────────────┘
```

## Q4: 前端自动化测试策略？[P8]

```
测试金字塔:
              ┌───────┐
              │  E2E  │  5% — Cypress/Playwright
              ├───────┤
           ┌──┤ 集成  │  15% — React Testing Library
           │  ├───────┤
        ┌──┤  │ 单元  │  80% — Jest/Vitest
        │  │  └───────┘
        │  │
      成本低  执行快
```

**关键策略**：
1. 单元测试：纯函数、工具库、Hooks
2. 集成测试：组件交互、状态管理、API调用
3. E2E 测试：核心用户流程（登录→下单→支付）
4. 视觉回归：Storybook + Chromatic

## Q5: 微前端的沙箱机制？[P9]

```javascript
// 1. Proxy 沙箱（推荐）
class ProxySandbox {
  constructor() {
    this.fakeWindow = {};
    this.proxy = new Proxy(this.fakeWindow, {
      get: (target, key) => key in target ? target[key] : window[key],
      set: (target, key, value) => { target[key] = value; return true; },
    });
  }
  activate() { /* 激活沙箱 */ }
  deactivate() { this.fakeWindow = {}; /* 清理 */ }
}

// 2. iframe 沙箱（天然隔离）
// 3. ShadowRealm (Stage 3 提案)

// CSS 隔离方案:
// 1. Shadow DOM (WebComponent)
// 2. CSS Modules
// 3. 命名空间前缀 (.app1-btn, .app2-btn)
// 4. CSS-in-JS (runtime namespace)
```

## Q6: 如何做前端性能监控？[P8]

```javascript
// 采集 Core Web Vitals
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(metric => report('LCP', metric));
onINP(metric => report('INP', metric));
onCLS(metric => report('CLS', metric));

function report(name, metric) {
  // 使用 sendBeacon 发送（页面关闭也能发）
  navigator.sendBeacon('/analytics', JSON.stringify({
    name, value: metric.value, rating: metric.rating,
    url: location.href, timestamp: Date.now(),
  }));
}

// 错误监控
window.addEventListener('error', (e) => {
  report('js_error', { message: e.message, stack: e.error?.stack });
});
window.addEventListener('unhandledrejection', (e) => {
  report('promise_error', { reason: String(e.reason) });
});
```
