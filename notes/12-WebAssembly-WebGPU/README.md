# WebAssembly & WebGPU

> **权威来源**：[MDN WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly)、[WebGPU 规范](https://www.w3.org/TR/webgpu/)

## 核心文件

| 文件 | 内容 | 难度 |
|------|------|------|
| [01-WebAssembly.md](./01-WebAssembly.md) | WebAssembly 原理与实战 | ⭐⭐⭐⭐ |
| [02-WebGPU.md](./02-WebGPU.md) | WebGPU 计算与渲染 | ⭐⭐⭐⭐⭐ |

## WebAssembly 核心

```
Rust/C++/Go 源码
      │
      ▼  编译
   .wasm 二进制模块
      │
      ▼  加载
JavaScript 调用
  WebAssembly.instantiateStreaming(fetch('module.wasm'))
```

**使用场景**：
- 图片/视频处理（如 Squoosh 在线压缩）
- 加密计算
- 游戏物理引擎
- 端侧 AI 推理（ONNX Runtime Web）
- PDF/Office 文档处理

## WebGPU 核心

```
WebGPU 管线:
Adapter → Device → Command Encoder → Render/Compute Pass → Queue

核心价值:
1. Compute Shaders — GPU 通用计算（AI推理/数据并行）
2. 比 WebGL 更低层、更灵活的 GPU 访问
3. 跨图形API抽象（Vulkan/Metal/DX12）
```

**使用场景**：
- 3D 渲染（Three.js + WebGPU backend）
- AI 模型推理（浏览器端）
- 大规模数据可视化
- 物理模拟
