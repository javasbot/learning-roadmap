# 亿级用户电商前端系统架构设计

> **参考来源**：[System Design Interview - Alex Xu](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)、阿里/美团/字节技术博客

## 一、需求分析

### 1.1 业务场景

设计一个支持 **5亿 DAU** 的电商前端系统（对标淘宝/拼多多），要求：

| 指标 | 目标 |
|------|------|
| 首屏性能 | FCP < 1s, LCP < 2.5s |
| 多端适配 | Web / H5 / 小程序 / Native |
| 灰度发布 | 支持千分之一粒度 |
| 容灾降级 | 核心链路 0 宕机 |
| 国际化 | 支持 RTL + 30+ 语言 |
| 并发峰值 | 双11：100万 QPS |

### 1.2 核心页面

```
首页（流量入口）→ 搜索/列表页 → 商品详情页 → 购物车 → 结算 → 支付 → 订单
```

## 二、整体架构

```
                        用户设备
                     ┌─────────────┐
                     │ Web/H5/小程序│
                     │ /Native App │
                     └──────┬──────┘
                            │
                     ┌──────▼──────┐
                     │   CDN Edge   │ ← 全球 CDN + Edge Computing
                     │   Network    │   静态资源 + Edge SSR
                     └──────┬──────┘
                            │
                     ┌──────▼──────┐
                     │   Gateway    │ ← API Gateway (Nginx/Kong)
                     │  限流/熔断   │   限流 + 熔断 + 灰度路由
                     │  灰度/认证   │   认证 + 负载均衡
                     └──────┬──────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
   ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
   │   BFF 层    │  │  SSR/RSC    │  │  实时服务    │
   │  (Node.js)  │  │   服务器     │  │ (WebSocket)  │
   │ 数据聚合    │  │  首屏渲染    │  │ 实时推送     │
   │ 接口编排    │  │  SEO优化     │  │ 价格变动     │
   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
          │                │                 │
   ┌──────▼─────────────────▼─────────────────▼────┐
   │              微前端容器层                        │
   │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌─────┐ │
   │  │ 首页 │ │ 搜索 │ │ 商详 │ │ 购物车│ │ 支付 │ │
   │  │子应用│ │子应用│ │子应用│ │子应用│ │子应用│ │
   │  └──────┘ └──────┘ └──────┘ └──────┘ └─────┘ │
   └───────────────────────┬───────────────────────┘
                           │
   ┌───────────────────────▼───────────────────────┐
   │              前端基础设施层                      │
   │  ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
   │  │ 性能监控  │ │ 错误上报  │ │ 埋点/AB实验   │   │
   │  │ APM系统  │ │ Sentry   │ │ 数据分析      │   │
   │  └──────────┘ └──────────┘ └──────────────┘   │
   │  ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
   │  │ 离线包   │ │ 预加载   │ │ Service Worker│   │
   │  │ 资源缓存 │ │ 智能预取 │ │ 离线能力      │   │
   │  └──────────┘ └──────────┘ └──────────────┘   │
   └───────────────────────────────────────────────┘
```

## 三、关键设计细节

### 3.1 首屏性能方案

```
目标: LCP < 2.5s → 实际目标 LCP < 1.5s

分层加载策略:
┌────────────────────────────────────────┐
│ P0: 骨架屏 (0-200ms)                   │ ← HTML 内联 CSS
├────────────────────────────────────────┤
│ P1: 首屏核心内容 (200ms-1s)             │ ← Edge SSR + Streaming
│     - 导航栏                           │
│     - 首屏商品瀑布流 (前6个)             │
│     - 搜索框                           │
├────────────────────────────────────────┤
│ P2: 非首屏内容 (1s-3s)                  │ ← 按需加载
│     - 下方商品列表                      │
│     - 推荐模块                         │
│     - 活动浮窗                         │
├────────────────────────────────────────┤
│ P3: 次要功能 (3s+)                     │ ← 空闲加载
│     - 个性化推荐                       │
│     - 广告模块                         │
│     - 数据埋点初始化                    │
└────────────────────────────────────────┘
```

**Edge SSR + Streaming HTML**：
```javascript
// Edge Function (Cloudflare Workers / Vercel Edge)
export default async function handler(req) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  
  // 立即发送 HTML Head + 骨架屏
  writer.write(encoder.encode(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>/* 内联关键 CSS */</style>
    </head>
    <body>
      <div id="skeleton"><!-- 骨架屏 HTML --></div>
      <div id="app">
  `));
  
  // 并行获取数据
  const [navigation, products] = await Promise.all([
    fetchNavigation(),
    fetchTopProducts(6),  // 只取首屏的6个商品
  ]);
  
  // 流式注入首屏内容
  writer.write(encoder.encode(renderToString(
    <App navigation={navigation} products={products} />
  )));
  
  // 发送剩余 HTML
  writer.write(encoder.encode(`
      </div>
      <script src="/app.js" defer></script>
    </body>
    </html>
  `));
  
  writer.close();
  
  return new Response(stream.readable, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
```

### 3.2 容灾降级方案

```
降级层次:
┌─────────────────────────────────────────────┐
│ Level 0: 正常服务                             │
│ 所有功能正常，个性化推荐，实时库存             │
├─────────────────────────────────────────────┤
│ Level 1: 轻度降级                             │
│ 关闭个性化推荐，使用通用推荐                   │
│ 关闭非核心 API 调用                           │
├─────────────────────────────────────────────┤
│ Level 2: 中度降级                             │
│ SSR 降级为 CSR                               │
│ 使用 CDN 缓存的上一版本数据                    │
│ 关闭实时库存，显示"请下单确认"                 │
├─────────────────────────────────────────────┤
│ Level 3: 重度降级                             │
│ 使用 Service Worker 缓存的离线页面             │
│ 只保留浏览和搜索功能，关闭交易链路             │
├─────────────────────────────────────────────┤
│ Level 4: 极端降级                             │
│ CDN 静态兜底页 (纯 HTML)                      │
│ 显示 "系统维护中，请稍后访问"                  │
└─────────────────────────────────────────────┘
```

**前端降级代码实现**：
```javascript
// 请求降级包装器
async function resilientFetch(url, options = {}) {
  const { timeout = 3000, fallback, retries = 2 } = options;
  
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timer);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries) {
        // 所有重试失败，使用降级方案
        console.warn(`Degraded: ${url}`, error);
        
        // 1. 尝试本地缓存
        const cached = await caches.match(url);
        if (cached) return cached.json();
        
        // 2. 使用兜底数据
        if (fallback) return typeof fallback === 'function' ? fallback() : fallback;
        
        throw error;
      }
      // 指数退避重试
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 100));
    }
  }
}
```

### 3.3 灰度发布方案

```
灰度策略:

用户请求 → Gateway 灰度路由
              │
    ┌─────────┼─────────────┐
    │         │             │
    ▼         ▼             ▼
 0.1% 用户  5% 用户       100% 用户
 新版 v2.1  新版 v2.1     旧版 v2.0
 (金丝雀)   (灰度放量)    (稳定版)

路由规则:
1. 用户 ID Hash → 分桶
2. 支持白名单（内部测试人员直接进新版）
3. 按地域灰度（先北京，再上海，再全国）
4. 按设备类型灰度（先 iOS，再 Android，再 Web）
```

```javascript
// 前端 Feature Flag 实现
class FeatureFlags {
  constructor(userId, config) {
    this.userId = userId;
    this.config = config;
  }
  
  isEnabled(featureName) {
    const feature = this.config[featureName];
    if (!feature) return false;
    
    // 白名单
    if (feature.whitelist?.includes(this.userId)) return true;
    
    // 百分比灰度
    if (feature.percentage) {
      const hash = this.hashUserId(this.userId);
      return hash % 10000 < feature.percentage * 100;
    }
    
    return feature.enabled || false;
  }
  
  hashUserId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
```

### 3.4 性能预算

| 指标 | 预算值 | 监控方式 |
|------|--------|---------|
| JS 总大小 | < 200KB gzip | CI/CD 检查 |
| CSS 总大小 | < 50KB gzip | CI/CD 检查 |
| 首屏图片 | < 500KB | Lighthouse CI |
| LCP | < 1.5s (P75) | RUM 监控 |
| INP | < 100ms (P75) | RUM 监控 |
| CLS | < 0.05 | RUM 监控 |
| TTFB | < 200ms | 服务端监控 |
| 首屏 API 数量 | ≤ 3 个 | 代码审查 |

### 3.5 全链路监控

```
前端监控体系:

用户端采集
├── Performance API → 性能指标 (LCP, FID, CLS, TTFB)
├── Error 事件 / unhandledrejection → 错误信息
├── 自定义埋点 → 业务指标 (点击率, 转化率)
└── Resource Timing → 资源加载耗时
         │
         ▼
    数据上报 SDK
    (beacon API / sendBeacon)
         │
         ▼
    数据处理层 (Kafka → Flink)
         │
    ┌────┼────┐
    │    │    │
    ▼    ▼    ▼
  实时   离线   告警
  大盘   分析   系统
```

## 四、面试作答模板

面试时按以下结构展开（限时30分钟）：

1. **需求澄清**（2分钟）：确认 DAU、核心指标、技术约束
2. **高层架构**（5分钟）：画出架构图，说明各层职责
3. **深入首屏性能**（8分钟）：Edge SSR + Streaming + 分级加载
4. **容灾降级**（5分钟）：多级降级策略 + 前端降级代码
5. **微前端拆分**（5分钟）：子应用划分策略 + 共享依赖
6. **监控体系**（3分钟）：全链路 Trace + 告警
7. **Trade-off 分析**（2分钟）：SSR vs CSR vs ISR 选型理由
