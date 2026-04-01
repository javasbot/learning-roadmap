/**
 * 解析 JS 中的裸依赖 (Bare Imports)
 * 浏览器其实不支持 `import { vue } from 'vue'`。它只支持 `import '/node_modules/vue/...'`
 * Vite 的强项之一，就是通过 es-module-lexer 或者正则表达式，动态地把 JS 代码里的裸模块重写成正确的相对路径
 */
function transformJs(code) {
  // 简易正则替换： import { xxx } from 'vue' -> import { xxx } from '/@modules/vue'
  // (真实世界的 Vite 使用更严谨的 AST，并配合 esbuild 预构建处理 CommonJS 杂交依赖)
  
  return code.replace(/from\s+['"]([^'"]+)['"]/g, (match, p1) => {
    // 如果是以 . 或 / 开头的路径，说明是合法的浏览器相对路径请求，保持原样
    if (p1.startsWith('.') || p1.startsWith('/')) {
      return match;
    }
    // TODO: 为了演示核心思想，真实的 Mini-Vite 会把这转到如 /@modules/xxxx 进行拦截
    // 并结合 node 的 require.resolve 找出真实的 node_modules 路径给出去。
    // 这也是 Vite Pre-Bundling (esbuild 启动时几毫秒预打包所有第三方库) 发力的核心入口！
    return match;
  });
}

/**
 * 将 CSS 转化为 JS 模块
 * 因为前端 HTML 除了 index.html 以外都是通过 <script type="module"> 加载的。
 * 他要是在 JS 文件里写了 import './style.css'，浏览器接到 css 后没法当作 module 执行会报错！
 * 
 * 所以这里的核心操作是劫持 CSS 源文件，套上一层 JS 壳子，让其作为一段向 DOM 插入 <style> 的执行时 JS 代码返回
 */
function transformCss(code) {
  // 把 css 里的回车符等清洗掉，或者用 JSON.stringify 包装成单行字串
  const cssStr = JSON.stringify(code);

  return `
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerHTML = ${cssStr}
    document.head.appendChild(style)
    
    // 如果开启 HMR 还要导出这个模块（真实情况还会使用 import.meta.hot API）
    export default ${cssStr}
  `;
}

module.exports = {
  transformJs,
  transformCss
};
