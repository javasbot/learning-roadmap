# 工程化体系

> **权威来源**：[Vite 文档](https://vitejs.dev)、[Turborepo 文档](https://turbo.build)

## 核心文件

| 文件 | 内容 | 难度 |
|------|------|------|
| [01-Build-Tools.md](./01-Build-Tools.md) | 构建工具：Vite/Webpack/Rspack原理 | ⭐⭐⭐⭐ |
| [02-Monorepo.md](./02-Monorepo.md) | Monorepo 治理方案 | ⭐⭐⭐⭐ |
| [03-CICD-Pipeline.md](./03-CICD-Pipeline.md) | CI/CD 流水线设计 | ⭐⭐⭐⭐ |

## 工程化全景

```
代码编写 → 代码质量 → 构建打包 → 自动化测试 → 部署上线 → 运行监控
   │         │         │          │          │         │
ESLint    Prettier   Vite      Jest      Docker    Sentry
TypeScript Husky     Rspack    Cypress   K8s       Prometheus
           lint-staged Turbopack Playwright  CDN      Grafana
```

## 构建工具核心对比

```
Webpack 原理:
所有文件 → Loader转换 → 依赖图 → 打包成bundle → 输出

Vite 原理:
开发: 浏览器原生ESM + 按需编译 (esbuild预构建依赖)
生产: Rollup 打包

Rspack 原理:
Rust 重写的 Webpack 兼容工具 (5-10x 更快)
```
