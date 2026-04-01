# 网络协议

> **权威来源**：[HTTP/2 RFC 9113](https://httpwg.org/specs/rfc9113.html)、[HTTP/3 RFC 9114](https://httpwg.org/specs/rfc9114.html)

## 核心文件

| 文件 | 内容 | 难度 |
|------|------|------|
| [01-HTTP2-HTTP3.md](./01-HTTP2-HTTP3.md) | HTTP/2 与 HTTP/3 (QUIC) | ⭐⭐⭐⭐ |
| [02-WebSocket-SSE.md](./02-WebSocket-SSE.md) | WebSocket 与 SSE | ⭐⭐⭐⭐ |

## 协议演进

```
HTTP/1.0 → HTTP/1.1 → HTTP/2 → HTTP/3
  │          │           │         │
  │          │           │         └── UDP (QUIC)
  │          │           └── 二进制帧/多路复用/头压缩
  │          └── 持久连接/管线化/Host头
  └── 每次请求新建TCP连接
```

## 前端开发者必知

| 协议 | 前端影响 |
|------|---------|
| HTTP/2 多路复用 | 不再需要合并请求、雪碧图、域名分片 |
| HTTP/2 Push | 可预推送资源（但实践中较少用） |
| HTTP/3 QUIC | 更快的连接建立、无队头阻塞 |
| WebSocket | 实时双向通信（聊天、协作、游戏） |
| SSE | 服务器单向推送（LLM流式输出、通知） |
