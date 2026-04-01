import { ProxySandbox } from './sandbox.js';

// 子应用注册表字典
const apps = [];

/**
 * 注册子应用
 * @param {string} name - 应用标识
 * @param {string} entry - 子应用 HTML 文件入口
 * @param {string} container - 要挂载的主应用节点 ID
 * @param {Function} activeRule - 判定何时该加载此子应用的规则
 */
export function registerMicroApps(appConfigs) {
  appConfigs.forEach(app => apps.push(app));
}

/**
 * 前端微路由监听
 */
export function start() {
  // 1. 监听 URL 变化
  window.addEventListener('popstate', onRouteMatch);
  // 重写 pushState 和 replaceState 因为它们不触发 popstate 事件
  const rawPushState = window.history.pushState;
  window.history.pushState = (...args) => {
    rawPushState.apply(window.history, args);
    onRouteMatch();
  };
  
  // 首次主动触发路由匹配
  onRouteMatch();
}

/**
 * 解析并匹配路由挂载当前正确的微应用
 */
async function onRouteMatch() {
  const currentPath = window.location.pathname;
  
  // 找出现阶段哪些该显示，哪些该卸载
  let appToMount = apps.find(app => currentPath.startsWith(app.activeRule));

  if (!appToMount) return;

  // 开始获取和解析子应用！(基于 import-html-entry 思想)
  await loadAndMountApp(appToMount);
}

/**
 * HTML Entry 解析与渲染
 */
async function loadAndMountApp(app) {
  const containerElement = document.querySelector(app.container);
  if (!containerElement) return;

  containerElement.innerHTML = `正在加载子应用 [${app.name}] ...`;

  try {
    // 1. 发起 Fetch 请求拿到子应用的 HTML 文本
    // **注意：由于安全性，演示 Demo 就不走真实 Fetch 改用内存模拟逻辑了，具体参见 Demo 实现**
    const htmlObj = await mockFetchHtml(app.entry);

    // 2. 拿到 HTML 把模板放进去
    containerElement.innerHTML = htmlObj.template;

    // 3. 构建对应的 Sandbox 沙箱
    const sandbox = new ProxySandbox(app.name);
    sandbox.activeSandbox();

    // 4. 利用闭包执行 JS
    htmlObj.scripts.forEach(scriptCode => {
      // P9 绝杀题：怎么让 fetch 下来的字符串 JS 代码在不污染全局并绑定 fakeWindow 的前提下执行？
      // 答案：使用 with 语法包裹 + new Function
      const executeFn = new Function(
        'window', 'self', 'globalThis',
        `
          with(window) {
            ${scriptCode}
          }
        `
      );
      
      // 传入被我们 proxy 夹带私货拦截后的 fakeWindow 进行调用
      executeFn.call(sandbox.proxy, sandbox.proxy, sandbox.proxy, sandbox.proxy);
    });

    console.log(`[容器框架] 子应用 ${app.name} 已挂载完成！`);
    
  } catch (error) {
    console.error("加载子应用失败: ", error);
  }
}

// ---------------- 以下为提供给 Demo 的辅助方法，真实的底层代码这里用的是 import-html-entry 开源库 ----------------
async function mockFetchHtml(url) {
  // 模拟从远程拉取两个不同子应用的过程
  if (url === '/app-vue/') {
    return {
      template: `<div id="sub-app-root"><h3>我是 Vue 子应用页面</h3></div>`,
      scripts: [
        `
        window.globalVariable = 'VueAppV1.0';  // 修改原本的主应用window！
        document.getElementById('sub-app-root').innerHTML += '<p>通过隔离的内部 window获取版本：' + window.globalVariable + '</p>';
        `
      ]
    }
  } else if (url === '/app-react/') {
    return {
      template: `<div id="sub-app-root"><h3>我是 React 子应用页面</h3></div>`,
      scripts: [
        `
        window.globalVariable = 'ReactAppV16.8';  // 再次修改主应用window！
        document.getElementById('sub-app-root').innerHTML += '<p>内部 window值防篡改获取：' + window.globalVariable + '</p>';
        `
      ]
    }
  }
}
