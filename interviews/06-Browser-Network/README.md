# 浏览器与网络面试题

## Q1: 从 URL 到页面展示全过程 [P7]

```
1. DNS 解析 → 域名转IP（先查缓存：浏览器→OS→路由器→ISP→递归查询）
2. TCP 三次握手（SYN → SYN+ACK → ACK）
3. TLS 握手（HTTPS，协商加密算法+交换密钥）
4. HTTP 请求发送
5. 服务器处理 → HTTP 响应
6. 浏览器解析 HTML
   - 构建 DOM Tree
   - 解析 CSS → CSSOM Tree
   - 执行 JavaScript（可阻塞解析）
7. 渲染管线：Style → Layout → Paint → Composite
8. 屏幕显示
```

## Q2: HTTP/1.1 vs HTTP/2 vs HTTP/3 [P8]

| 特性 | HTTP/1.1 | HTTP/2 | HTTP/3 |
|------|----------|--------|--------|
| 传输层 | TCP | TCP | **QUIC (UDP)** |
| 多路复用 | ❌ (队头阻塞) | ✅ 二进制帧 | ✅ |
| 头部压缩 | ❌ | HPACK | QPACK |
| 服务器推送 | ❌ | ✅ | ✅ |
| 连接迁移 | ❌ | ❌ | ✅ (Connection ID) |
| 0-RTT | ❌ | ❌ | ✅ |

**HTTP/3 的核心优势**：基于 QUIC(UDP)，解决了 TCP 层的队头阻塞；支持连接迁移（网络切换不断开）；0-RTT 快速恢复连接。

## Q3: 强缓存 vs 协商缓存 [P7]

```
强缓存（不发请求）:
Cache-Control: max-age=31536000  → 1年内直接用缓存
                  │
                  └── 命中: 200 (from cache) → 不发请求
                  └── 未命中: 进入协商缓存

协商缓存（发请求验证）:
ETag / If-None-Match        → 内容hash对比
Last-Modified / If-Modified-Since → 时间对比
                  │
                  └── 未变化: 304 Not Modified → 用缓存
                  └── 已变化: 200 + 新资源
```

**最佳实践**：
```
HTML文件:    Cache-Control: no-cache (每次协商)
JS/CSS/图片: Cache-Control: max-age=31536000 + 文件名hash
API响应:     Cache-Control: no-store 或 max-age=60
```

## Q4: CORS 跨域 [P7]

```
简单请求 (GET/HEAD/POST + 简单头):
浏览器 → 直接发请求 + Origin 头 → 服务器返回 Access-Control-Allow-Origin

预检请求 (PUT/DELETE/自定义头/Content-Type非简单):
浏览器 → OPTIONS 预检 → 服务器返回允许的方法/头/来源
     → 浏览器 → 实际请求

解决方案:
1. 后端设置 CORS 头（推荐）
2. Nginx 反向代理
3. 开发环境使用 devServer proxy
```

## Q5: XSS 和 CSRF 防御 [P8]

**XSS 防御**：
```javascript
// 1. 输出编码
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
// 2. CSP 策略
// Content-Security-Policy: default-src 'self'; script-src 'self'
// 3. HttpOnly Cookie（JS无法读取）
// 4. React自动转义（dangerouslySetInnerHTML除外）
```

**CSRF 防御**：
```
1. CSRF Token（服务端生成，表单/请求头携带）
2. SameSite Cookie 属性: Strict / Lax
3. 检查 Referer / Origin 头
4. 双重Cookie验证
```

## Q6: WebSocket 连接管理 [P8]

```javascript
class ReconnectingWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.maxRetries = options.maxRetries || 10;
    this.retries = 0;
    this.listeners = new Map();
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => { this.retries = 0; this.emit('open'); };
    this.ws.onmessage = (e) => this.emit('message', JSON.parse(e.data));
    this.ws.onclose = (e) => {
      if (e.code !== 1000 && this.retries < this.maxRetries) {
        // 指数退避重连
        const delay = Math.min(1000 * Math.pow(2, this.retries++), 30000);
        setTimeout(() => this.connect(), delay);
      }
    };
    this.ws.onerror = () => this.emit('error');
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
  
  // 心跳保活
  startHeartbeat(interval = 30000) {
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'ping' });
    }, interval);
  }
}
```

## Q7: Service Worker 生命周期 [P8]

```
注册 → 安装(install) → 等待(waiting) → 激活(activate) → 拦截请求(fetch)
                                │
                           旧SW仍在运行
                           需要关闭所有tab
                           或 self.skipWaiting()
```

```javascript
// sw.js
const CACHE_NAME = 'v1';
const URLS_TO_CACHE = ['/', '/styles.css', '/app.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting(); // 跳过等待，立即激活
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
```
