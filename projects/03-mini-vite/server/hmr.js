const WebSocket = require('ws');
const chokidar = require('chokidar');

/**
 * HMR (热模块替换) 核心引擎
 */
function setupHMR(server, root) {
  // 1. 在当前搭建的 Http Server 上附加一个 WebSocket Server
  const wss = new WebSocket.Server({ server });

  // 连接池（页面开启多个 Tab 就有多个连接）
  const sockets = new Set();
  wss.on('connection', (ws) => {
    sockets.add(ws);
    ws.on('close', () => {
      sockets.delete(ws);
    });
  });

  // 2. 借助 chokidar 监听文件系统的变化！
  const watcher = chokidar.watch(root, {
    ignored: [/node_modules/, /\.git/],
    ignoreInitial: true,
  });

  // 3. 一旦文件变了，广播通知所有的连接端
  watcher.on('change', (file) => {
    console.log(`[HMR] 文件发生了变化: ${file}`);
    
    const sendData = JSON.stringify({
      type: 'update',
      path: '/' + file.replace(root, '').replace(/\\/g, '/').replace(/^\//, ''),
      timestamp: Date.now() // 时间戳，用来解决浏览器的强缓存，打破请求复用
    });

    sockets.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(sendData);
      }
    });
  });
}

module.exports = { setupHMR };
