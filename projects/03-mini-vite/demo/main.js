// Mini Vite 的奇迹发生地：我们在 JS 里引用 CSS！
import './style.css';

document.getElementById('app').innerHTML = `
  <div class="card">
    <h2>你好，我是被 Server <span class="highlight">拦截</span> 返回的 JS 组件。</h2>
    <p>当前渲染时间戳: ${new Date().toLocaleTimeString()}</p>
  </div>
`;

console.log("【APP】主文件已加载！如果你改动了我，页面将会强制刷新 (Hard Reload)。如果你只改动了 CSS，你会看到无缝热插入！");
