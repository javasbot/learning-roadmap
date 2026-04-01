# 跨端架构

## 核心文件

| 文件 | 内容 | 难度 |
|------|------|------|
| [01-Multi-Platform-Strategy.md](./01-Multi-Platform-Strategy.md) | 多端架构策略 | ⭐⭐⭐⭐ |

## 跨端方案对比

| 方案 | 原理 | 性能 | 生态 | 适用场景 |
|------|------|------|------|---------|
| **Web (PWA)** | 浏览器渲染 | 中 | ⭐⭐⭐⭐⭐ | 轻量应用 |
| **React Native** | 原生组件桥接 | 高 | ⭐⭐⭐⭐ | 中大型APP |
| **Flutter** | Skia/Impeller渲染 | 最高 | ⭐⭐⭐ | 高性能APP |
| **小程序** | WebView + 原生组件 | 中 | ⭐⭐⭐ | 微信/支付宝 |
| **Taro/uni-app** | 多端一套代码编译 | 中 | ⭐⭐⭐ | 多端适配 |

## 架构选型决策树

```
需要原生性能？
├── 是 → Flutter / 原生开发
└── 否 → 需要 APP Store 分发？
          ├── 是 → React Native / Expo
          └── 否 → 需要多端(含小程序)？
                    ├── 是 → Taro / uni-app
                    └── 否 → PWA / 响应式 Web
```
