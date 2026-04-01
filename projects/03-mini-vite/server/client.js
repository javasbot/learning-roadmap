// 注入给浏览器的客户端通讯脚本 (其实它会由 server.js 在页面加载时自动注入)
// 因为要运行在浏览器里，不能使用 node 模块或语法

console.log('[vite] connecting...');
const socket = new WebSocket(`ws://${location.host}`);

socket.addEventListener('message', async ({ data }) => {
  const payload = JSON.parse(data);

  if (payload.type === 'update') {
    console.log(`[vite] hot updated: ${payload.path}`);
    
    if (payload.path.endsWith('.css')) {
      // ✅ CSS 热更新最简单：因为 CSS 没有副作用，且在服务端被处理成了操作 DOM 添加 <style>。
      // 我们直接给带了个新时间戳 URL 继续 import 一下就行了！
      const newPath = `${payload.path}?t=${payload.timestamp}`;
      await import(newPath);
      
      // 注意：成熟版会有去重机制，删掉上一个旧的 <style> 标签
    } else {
      // ✅ JS 重载逻辑就复杂了：如果不是只改了一个无副作用单页面数据，最好直接 reload 防止内存雪崩
      // 完整的 Vite 实现了 import.meta.hot API，让开发者/框架自己声明怎样安全的销毁和重载老模块
      location.reload();
    }
  }
});

socket.addEventListener('open', () => {
  console.log('[vite] connected.');
});
