# CSS 工程化与设计系统

> **权威来源**：[web.dev CSS](https://web.dev/learn/css)、[Open Props](https://open-props.style)

## 核心文件

| 文件 | 内容 | 难度 |
|------|------|------|
| [01-Modern-CSS.md](./01-Modern-CSS.md) | 现代 CSS 特性 | ⭐⭐⭐ |
| [02-Design-Token.md](./02-Design-Token.md) | Design Token 体系 | ⭐⭐⭐⭐ |
| [03-Design-System.md](./03-Design-System.md) | 设计系统架构 | ⭐⭐⭐⭐⭐ |

## 现代 CSS 特性一览

| 特性 | 用途 | 浏览器支持 |
|------|------|-----------|
| Container Queries | 组件级响应式 | ✅ 全支持 |
| `:has()` | 父元素选择器 | ✅ 全支持 |
| CSS Nesting | 原生嵌套 | ✅ 全支持 |
| Anchor Positioning | 锚点定位(Tooltip) | 🟡 Chrome |
| Scroll-driven Animations | 滚动动画 | 🟡 Chrome |
| `@scope` | 作用域样式 | 🟡 Chrome |
| View Transitions API | 页面过渡动画 | 🟡 Chrome |
| OKLCH | 感知均匀颜色 | ✅ 全支持 |
| `@layer` | 级联层 | ✅ 全支持 |

## Design Token 体系

```css
/* Design Tokens（设计变量）*/
:root {
  /* 颜色 */
  --color-primary: oklch(0.6 0.2 260);
  --color-surface: oklch(0.98 0.01 260);
  
  /* 间距 */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  
  /* 字体 */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px oklch(0 0 0 / 0.1);
}
```
