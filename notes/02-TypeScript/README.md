# TypeScript 高级类型系统

> **权威来源**：[TypeScript 官方文档](https://www.typescriptlang.org/docs/)、[TypeScript GitHub](https://github.com/microsoft/TypeScript)

## 模块概览

TypeScript 3%（前端深度权重）是 P10 前端架构师的必备能力，尤其在大规模应用和 Monorepo 中，高级类型系统是保证代码质量和团队协作的基石。

## 学习路线

```
基础类型 → 泛型编程 → 条件类型 → 映射类型 → 模板字面量类型 → 类型体操 → 类型系统架构
```

## 核心文件

| 文件 | 内容 | 难度 |
|------|------|------|
| [01-Advanced-Types.md](./01-Advanced-Types.md) | 高级类型系统：条件类型、映射类型、infer、模板字面量 | ⭐⭐⭐⭐ |
| [02-Generic-Programming.md](./02-Generic-Programming.md) | 泛型编程：约束、默认值、协变逆变、高级泛型模式 | ⭐⭐⭐⭐ |
| [03-Type-Gymnastics.md](./03-Type-Gymnastics.md) | 类型体操实战：常见挑战题、类型工具库设计 | ⭐⭐⭐⭐⭐ |

## 核心知识思维导图

```
TypeScript 高级类型
├── 条件类型 (Conditional Types)
│   ├── extends 关键字
│   ├── infer 类型推断
│   └── 分布式条件类型 (Distributive)
├── 映射类型 (Mapped Types)
│   ├── keyof / in
│   ├── 内置工具类型 (Partial, Required, Pick, Omit)
│   └── 自定义映射
├── 模板字面量类型 (Template Literal Types)
│   ├── 字符串操作类型
│   └── 模式匹配
├── 类型守卫 (Type Guards)
│   ├── typeof / instanceof
│   ├── in 操作符
│   └── 自定义类型谓词 (is)
├── 泛型高级
│   ├── 约束与默认值
│   ├── 协变与逆变
│   └── 高阶类型 (Higher-Kinded Types 模拟)
└── 声明文件与模块系统
    ├── .d.ts 编写
    ├── 模块增强 (Module Augmentation)
    └── 全局类型扩展
```
