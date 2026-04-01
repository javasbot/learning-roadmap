# 手写 Mini Vite 项目

## 项目目标
实现一个简化版 Vite，理解现代构建工具的核心原理。

## 核心功能

### 1. Dev Server（开发服务器）
```javascript
// 基于原生 ESM 的开发服务器
const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(async (req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  
  if (url.endsWith('.js') || url.endsWith('.ts')) {
    // 按需编译：只在请求时才编译
    const code = await transformModule(path.join(root, url));
    res.setHeader('Content-Type', 'application/javascript');
    res.end(code);
  } else if (url.endsWith('.css')) {
    // CSS 转为 JS 模块（HMR 支持）
    const css = fs.readFileSync(path.join(root, url), 'utf-8');
    const code = `const style = document.createElement('style');
      style.textContent = ${JSON.stringify(css)};
      document.head.appendChild(style);`;
    res.setHeader('Content-Type', 'application/javascript');
    res.end(code);
  }
}).listen(3000);
```

### 2. HMR（热模块替换）
```javascript
// WebSocket 服务端
const wss = new WebSocketServer({ port: 24678 });

// 文件监听
chokidar.watch(root).on('change', (file) => {
  wss.clients.forEach(client => {
    client.send(JSON.stringify({ type: 'update', path: file }));
  });
});

// 客户端 HMR 运行时
const ws = new WebSocket('ws://localhost:24678');
ws.onmessage = (e) => {
  const { type, path } = JSON.parse(e.data);
  if (type === 'update') {
    // 重新导入模块（带时间戳破坏缓存）
    import(`${path}?t=${Date.now()}`);
  }
};
```

### 3. 依赖预构建（Pre-bundling）
```javascript
// 使用 esbuild 预构建 node_modules 依赖
const esbuild = require('esbuild');

async function prebundle(deps) {
  await esbuild.build({
    entryPoints: deps,  // ['react', 'react-dom']
    bundle: true,
    format: 'esm',
    outdir: 'node_modules/.vite',
  });
}
```

## 学习产出
- [ ] 实现基于 ESM 的 Dev Server
- [ ] 实现 HMR（WebSocket + 模块替换）
- [ ] 实现 CSS/JSON 模块转换
- [ ] 实现依赖预构建（esbuild）
- [ ] 撰写 2 篇技术博客
