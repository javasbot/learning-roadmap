const http = require('http');
const path = require('path');
const fs = require('fs');
const { transformCss, transformJs } = require('./plugins.js');
const { setupHMR } = require('./hmr.js');

// 定义运行时的根目录
const root = path.resolve(__dirname, '../demo');

/**
 * Vite 为什么这么快？
 * 它是典型的 "Bundleless" 方案。利用了现代浏览器原生支持 <script type="module"> 的特性。
 * 浏览器看到 import，就会自己发起 HTTP 请求去拿文件。
 * Vite 本质上就是一个 Web Server，它拦截这些浏览器的原生资源请求，
 * 在服务端做**按需编译**，然后再返回给浏览器。
 */
const server = http.createServer((req, res) => {
  let url = req.url;

  // 1. 访问根目录时，默认返回 index.html
  if (url === '/') {
    url = '/index.html';
    const filePath = path.join(root, url);
    let html = fs.readFileSync(filePath, 'utf-8');
    
    // 注入 HMR 客户端脚本
    html = html.replace(
      '<head>',
      `<head>\n    <script type="module" src="/@vite/client"></script>`
    );
    
    res.setHeader('Content-Type', 'text/html');
    return res.end(html);
  }

  // 2. 注入内部 HMR 客户端逻辑 (前端用来和 WebSocket 通信的桥梁)
  if (url === '/@vite/client') {
    const clientCode = fs.readFileSync(path.join(__dirname, 'client.js'), 'utf-8');
    res.setHeader('Content-Type', 'application/javascript');
    return res.end(clientCode);
  }

  // 获取真实文件路径
  const filePath = path.join(root, url);
  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    return res.end('Not found');
  }

  // 3. 拦截 JS 文件：如果是 ES6，我们其实可以直接用，但为了处理裸依赖问题，需要简单 transform
  if (url.endsWith('.js')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const transformedCode = transformJs(content); // 处理 import 'vue' 这种裸模块
    res.setHeader('Content-Type', 'application/javascript');
    return res.end(transformedCode);
  }

  // 4. 拦截 CSS 文件：浏览器无法 'import' 一个 css 文件，必须把它包一层转成 JavaScript
  if (url.endsWith('.css')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const transformedCode = transformCss(content); // 把 CSS 变成了 document.createElement('style') 操作
    res.setHeader('Content-Type', 'application/javascript');
    return res.end(transformedCode);
  }

  // 5. 其他静态资源，直接返回即可
  const content = fs.readFileSync(filePath);
  res.end(content);
});

// 挂载 WebSocket HMR 支持
setupHMR(server, root);

// 启动服务
server.listen(3000, () => {
  console.log('⚡️ Mini Vite running at http://localhost:3000');
});
