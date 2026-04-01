# 浏览器渲染管线（Rendering Pipeline）

> **权威来源**：[Chrome Developers - Rendering Performance](https://developer.chrome.com/docs/devtools/performance/)、[Chromium Rendering Architecture](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/how_cc_works.md)

## 一、从 URL 到页面展示的完整流程

```
用户输入 URL
    │
    ▼
┌─────────────────────────────────────────────────────┐
│           1. 网络请求阶段                              │
│  DNS 解析 → TCP 连接(TLS) → HTTP 请求 → 响应          │
└─────────────────────┬───────────────────────────────┘
                      │ HTML 文档
                      ▼
┌─────────────────────────────────────────────────────┐
│           2. 解析阶段                                  │
│  HTML Parser → DOM Tree                               │
│  CSS Parser → CSSOM Tree                              │
│  JavaScript 执行 (可能阻塞解析)                         │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│           3. 渲染管线                                  │
│  Style → Layout → Paint → Composite                  │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
                 屏幕显示像素
```

## 二、渲染管线详解

### 2.1 五个阶段

```
┌──────┐   ┌────────┐   ┌──────┐   ┌───────┐   ┌───────────┐
│Style │ → │ Layout │ → │Paint │ → │Layeriz│ → │ Composite │
│计算样式│   │布局/重排│   │绘制   │   │分层   │   │合成       │
└──────┘   └────────┘   └──────┘   └───────┘   └───────────┘
   │           │            │           │            │
   ▼           ▼            ▼           ▼            ▼
 计算每个    计算每个     生成绘制    创建图层    GPU合成
 元素的      元素的       指令列表    (Layers)    最终画面
 最终样式    几何信息     (DisplayList)
```

### 2.2 Style（样式计算）

```
DOM Tree + CSSOM Tree → Computed Styles

过程:
1. 收集所有样式规则（<style>、<link>、inline style、UA stylesheet）
2. 样式匹配：选择器从右到左匹配
3. 样式级联：处理优先级（!important > inline > id > class > tag）
4. 样式继承：可继承属性传递给子元素
5. 值计算：相对单位转绝对值（em → px, % → px）
```

**性能要点**：
- 选择器复杂度影响匹配速度：`.a .b .c .d` 慢于 `.direct-class`
- 减少样式规则数量
- 避免 `:nth-child()` 等复杂伪类选择器

### 2.3 Layout（布局/重排）

```
Computed Styles → Layout Tree → 几何信息（位置、大小）

Layout Tree ≠ DOM Tree:
- display:none 的元素不在 Layout Tree 中
- ::before/::after 伪元素在 Layout Tree 中
- 匿名行盒/块盒

每个节点的输出:
{
  x: 100,      // 水平位置
  y: 200,      // 垂直位置
  width: 300,  // 宽度
  height: 150  // 高度
}
```

**触发 Layout（重排）的操作**：
```javascript
// ⚠️ 以下操作会触发重排
element.offsetWidth / offsetHeight / offsetTop / offsetLeft
element.clientWidth / clientHeight
element.scrollWidth / scrollHeight / scrollTop
element.getBoundingClientRect()
window.getComputedStyle()
element.style.width = '100px';
element.style.height = '200px';
element.style.top = '50px';
element.style.display = 'none';
element.style.fontSize = '16px';
element.className = 'new-class';
```

**强制同步布局（Forced Synchronous Layout）— 布局抖动**：
```javascript
// ❌ 布局抖动（Layout Thrashing）
const elements = document.querySelectorAll('.item');
for (let i = 0; i < elements.length; i++) {
  // 读取 → 触发布局 → 写入 → 使布局失效 → 读取 → 再次触发布局...
  const height = elements[i].offsetHeight;  // 读（触发布局）
  elements[i].style.height = height * 2 + 'px';  // 写（使布局失效）
}

// ✅ 批量读写模式
const heights = [];
// 先批量读
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight);
}
// 再批量写
for (let i = 0; i < elements.length; i++) {
  elements[i].style.height = heights[i] * 2 + 'px';
}

// ✅ 使用 requestAnimationFrame
function batchUpdate() {
  requestAnimationFrame(() => {
    // 所有写操作放在 rAF 中
    elements.forEach((el, i) => {
      el.style.height = heights[i] * 2 + 'px';
    });
  });
}
```

### 2.4 Paint（绘制）

```
Layout Tree → Paint Records (绘制指令列表)

绘制顺序（Stacking Order）:
1. 背景色
2. 背景图
3. 边框
4. 子元素（按文档流顺序）
5. 轮廓（outline）

绘制指令示例:
[
  { op: 'drawRect', color: '#fff', x: 0, y: 0, w: 100, h: 50 },
  { op: 'drawText', text: 'Hello', x: 10, y: 30, font: '16px Arial' },
  { op: 'drawBorder', color: '#000', x: 0, y: 0, w: 100, h: 50 }
]
```

**触发 Paint（重绘）但不触发 Layout 的操作**：
```javascript
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.visibility = 'hidden';  // 不触发layout, 触发paint
element.style.boxShadow = '0 0 10px black';
element.style.borderRadius = '5px';
```

### 2.5 Composite（合成）

```
Paint Records → 光栅化（Rasterization）→ 图层合成 → 屏幕像素

关键概念:
- 图层（Layer）: 独立的绘制面
- 光栅化: 将绘制指令转化为位图（Bitmap）
- 合成: GPU 将多个图层合成最终画面

     Layer 1 (背景)
         +
     Layer 2 (主内容)       GPU 合成
         +              ─────────→  最终画面
     Layer 3 (悬浮元素)
```

## 三、关键优化策略

### 3.1 只触发 Composite（最优路径）

以下 CSS 属性只触发 Composite，不触发 Layout 和 Paint：

```css
/* ✅ 只触发合成的属性 — 性能最优 */
transform: translate(10px, 20px);  /* 位移 */
transform: scale(1.5);            /* 缩放 */
transform: rotate(45deg);         /* 旋转 */
opacity: 0.5;                     /* 透明度 */

/* 这些属性的变化由 GPU 直接处理，主线程零开销 */
```

### 3.2 创建独立合成层

```css
/* 以下情况会创建合成层 */
.gpu-layer {
  will-change: transform;  /* 提示浏览器，最推荐 */
  transform: translateZ(0); /* 传统 hack */
  backface-visibility: hidden; /* 传统 hack */
}

/* 避免层爆炸 */
/* 过多的合成层会消耗大量显存 */
```

### 3.3 CSS contain 属性

```css
/* contain 限制浏览器重新计算的范围 */
.isolated-component {
  contain: layout;   /* 布局隔离：内部布局变化不影响外部 */
  contain: paint;    /* 绘制隔离：内部绘制不溢出边界 */
  contain: size;     /* 大小隔离：不依赖子元素确定大小 */
  contain: style;    /* 样式隔离：计数器和引号不影响外部 */
  contain: content;  /* = layout + paint + style */
  contain: strict;   /* = layout + paint + size + style */
}

/* content-visibility 更强力的优化 */
.offscreen-content {
  content-visibility: auto;  /* 屏幕外的内容跳过渲染 */
  contain-intrinsic-size: 200px; /* 提供占位大小 */
}
```

## 四、Core Web Vitals 优化

```
┌──────────────────────────────────────────────┐
│            Core Web Vitals (2024+)           │
├──────────┬──────────┬────────────────────────┤
│   LCP    │   INP    │        CLS             │
│ ≤ 2.5s   │ ≤ 200ms  │      ≤ 0.1             │
│最大内容   │交互到下一 │  累积布局               │
│绘制时间  │帧绘制延迟 │  偏移量                 │
└──────────┴──────────┴────────────────────────┘
```

### LCP 优化

```html
<!-- 1. 预加载 LCP 资源 -->
<link rel="preload" as="image" href="hero.webp" fetchpriority="high">

<!-- 2. 避免懒加载 LCP 图片 -->
<img src="hero.webp" alt="Hero" loading="eager" fetchpriority="high">

<!-- 3. 使用 CDN + 现代图片格式 -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero">
</picture>
```

### INP 优化

```javascript
// 1. 使用 requestIdleCallback 延迟非关键工作
requestIdleCallback(() => {
  analytics.track('page_view');
});

// 2. 使用 isInputPending() 检查待处理输入
function processTasks(tasks) {
  while (tasks.length > 0) {
    if (navigator.scheduling?.isInputPending()) {
      // 有用户输入待处理，让出主线程
      setTimeout(() => processTasks(tasks), 0);
      return;
    }
    const task = tasks.shift();
    task();
  }
}

// 3. 使用 Web Worker 处理重计算
const worker = new Worker('heavy-calc.js');
worker.postMessage(data);
worker.onmessage = (e) => updateUI(e.data);
```

### CLS 优化

```css
/* 1. 图片/视频设置固定尺寸 */
img, video {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}

/* 2. 动态内容使用 min-height 占位 */
.ad-slot {
  min-height: 250px;
}

/* 3. 避免在现有内容上方插入元素 */
/* 4. 使用 transform 动画代替改变位置属性 */
```

## 五、面试高频题

### Q1: 简述从输入 URL 到页面展示的全过程
**答**：DNS解析 → TCP三次握手(+TLS) → HTTP请求 → 接收响应 → HTML解析(构建DOM) → CSS解析(构建CSSOM) → 合成Render Tree → Layout(计算位置大小) → Paint(生成绘制指令) → Composite(GPU合成) → 显示

### Q2: 重排(Reflow)和重绘(Repaint)的区别？如何避免？
**答**：重排是几何属性变化导致重新计算位置大小（必触发重绘）；重绘是外观属性变化但不影响布局。避免方法：1) 使用 transform/opacity 做动画；2) 批量读写 DOM；3) 使用 CSS contain 隔离；4) 使用 requestAnimationFrame；5) 虚拟DOM批量更新。

### Q3: `will-change` 的作用和使用注意事项？
**答**：`will-change` 提示浏览器元素即将发生变化，浏览器会提前创建合成层、分配GPU资源。注意事项：1) 不要滥用（每个合成层消耗GPU内存）；2) 变化结束后要移除；3) 不要对太多元素使用；4) 优先在 hover 时添加而非始终存在。
