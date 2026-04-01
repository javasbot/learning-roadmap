# CSS / HTML 面试题

## Q1: BFC（块级格式化上下文）[P7]

**触发条件**：
- `overflow` 不为 visible
- `display` 为 inline-block / flex / grid / table
- `position` 为 absolute / fixed
- `float` 不为 none

**作用**：
1. 阻止 margin 合并
2. 阻止浮动元素覆盖
3. 清除浮动

## Q2: Flex 布局 vs Grid 布局 [P7]

```css
/* Flex: 一维布局（行或列）*/
.flex-container {
  display: flex;
  justify-content: center;  /* 主轴对齐 */
  align-items: center;      /* 交叉轴对齐 */
  gap: 16px;
}

/* Grid: 二维布局（行和列）*/
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
```

**选择原则**：一行/一列 → Flex；行列都要控制 → Grid

## Q3: CSS 现代特性（2024+）[P8]

```css
/* 1. Container Queries — 组件级响应式 */
.card-container { container-type: inline-size; }
@container (min-width: 400px) {
  .card { flex-direction: row; }
}

/* 2. :has() — 父元素选择器 */
.form:has(input:invalid) { border: 2px solid red; }
li:has(> a:hover) { background: #eee; }

/* 3. CSS Nesting — 原生嵌套 */
.card {
  padding: 1rem;
  & .title { font-size: 1.5rem; }
  &:hover { box-shadow: 0 4px 8px rgba(0,0,0,.1); }
}

/* 4. Scroll-driven Animations — 滚动驱动动画 */
.progress-bar {
  animation: grow linear;
  animation-timeline: scroll();
}
@keyframes grow { from { width: 0; } to { width: 100%; } }

/* 5. OKLCH 颜色空间 — 感知均匀 */
color: oklch(0.7 0.15 150);
color: oklch(from var(--primary) calc(l + 0.1) c h); /* 相对颜色 */

/* 6. Anchor Positioning — 锚点定位 */
.tooltip {
  position: fixed;
  anchor-name: --trigger;
  top: anchor(--trigger bottom);
  left: anchor(--trigger center);
}
```

## Q4: CSS 性能优化 [P8]

```css
/* 1. contain — 限制浏览器重算范围 */
.component { contain: content; }  /* layout + paint + style */

/* 2. content-visibility — 跳过屏幕外渲染 */
.heavy-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}

/* 3. will-change — GPU 加速 */
.animated { will-change: transform, opacity; }
/* 用完移除，避免内存浪费 */

/* 4. 用 transform 代替位置属性做动画 */
/* ❌ */ .move { left: 100px; }     /* 触发 layout */
/* ✅ */ .move { transform: translateX(100px); } /* 只触发 composite */

/* 5. 减少选择器复杂度 */
/* ❌ */ div.container > ul > li > a.link { }
/* ✅ */ .nav-link { }
```

## Q5: 语义化 HTML [P7]

```html
<header>  <!-- 页头 -->
<nav>     <!-- 导航 -->
<main>    <!-- 主内容（每页唯一） -->
<article> <!-- 独立内容 -->
<section> <!-- 主题分组 -->
<aside>   <!-- 侧边栏 -->
<footer>  <!-- 页脚 -->
<figure>  <!-- 图片 + 标题 -->
<figcaption> <!-- 图片标题 -->
<time>    <!-- 时间 -->
<mark>    <!-- 高亮文本 -->
<details> <!-- 折叠内容 -->
<dialog>  <!-- 模态对话框 -->
```

**好处**：SEO优化、无障碍访问(Accessibility)、代码可读性

## Q6: 层叠上下文(Stacking Context) [P8]

```
层叠顺序（从低到高）:
1. 背景和边框
2. z-index 为负的定位元素
3. 常规文档流中的块级元素
4. 浮动元素
5. 常规文档流中的行内元素
6. z-index: 0 / auto 的定位元素
7. z-index 为正的定位元素

创建新层叠上下文的方式:
- position + z-index (非 auto)
- opacity < 1
- transform / filter / backdrop-filter (非 none)
- will-change
- isolation: isolate
```

## Q7: 响应式设计方案 [P7]

```css
/* 1. 媒体查询 */
@media (max-width: 768px) { .sidebar { display: none; } }

/* 2. clamp() — 流体排版 */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }

/* 3. Container Queries — 组件级（推荐） */
@container sidebar (min-width: 300px) { ... }

/* 4. Grid auto-fill — 自适应网格 */
.grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }

/* 5. aspect-ratio — 保持宽高比 */
.video { aspect-ratio: 16 / 9; width: 100%; }
```
