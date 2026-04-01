# Node.js 深度解析

> **权威来源**：[Node.js 官方文档](https://nodejs.org/docs)、[libuv 文档](http://docs.libuv.org)

## 核心文件

| 文件 | 内容 | 难度 |
|------|------|------|
| [01-Event-Loop-Libuv.md](./01-Event-Loop-Libuv.md) | Node.js 事件循环与 libuv | ⭐⭐⭐⭐ |
| [02-Stream-Buffer.md](./02-Stream-Buffer.md) | Stream 与 Buffer | ⭐⭐⭐⭐ |
| [03-Cluster-Process.md](./03-Cluster-Process.md) | Cluster 与多进程 | ⭐⭐⭐⭐ |

## Node.js 架构

```
JavaScript 代码
      │
┌─────▼─────┐
│   V8 引擎  │ ← JS 执行
└─────┬─────┘
      │
┌─────▼─────┐
│ Node.js   │ ← C++ Bindings (fs, net, crypto...)
│ Bindings  │
└─────┬─────┘
      │
┌─────▼─────┐
│   libuv    │ ← 跨平台异步I/O库
│ 事件循环   │   线程池(4)处理文件I/O、DNS等
│ 线程池     │   epoll/kqueue/IOCP 处理网络I/O
└───────────┘
```

## 核心知识点

| 主题 | 关键内容 |
|------|---------|
| 事件循环 | 6阶段（timers→pending→idle→poll→check→close）|
| Stream | 4种类型（Readable/Writable/Duplex/Transform）|
| Buffer | 二进制数据处理，V8堆外内存 |
| Cluster | master-worker 模式，利用多核CPU |
| Worker Threads | 真正的多线程（SharedArrayBuffer共享内存）|
| child_process | fork/exec/spawn 多进程 |
