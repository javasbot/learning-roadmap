# 深入解析 Vite：下一代的前端构建基石

> 原理级连环拷问：为什么 Webpack 热更新和冷启那么慢？Vite 为什么不打包也能跑？`esbuild` 是如何在中间起到了核武器般加速的作用？

## Webpack 的痛（Bundle-Based）
所有的模块：无论你首屏看不看得到，它都是通过静态分析抽象语法树（AST），深挖到底把所有 `require/import` 统统打包好。这个图谱像个毛线团。哪怕只改了一行 CSS，它也要解开重新打包并输出 chunk 文件。虽然配合 dev-server 加速，但在超千万行、三千个依赖的企业级中台项目上，Webpack 的 `npm run dev` 冷启能慢到达惊人的 **3-5 分钟**。HMR（热更新）达到 **10+ 秒**延迟。

## Mini-Vite 解法 (Bundleless)
你跑了 `node server/index.js` 之后一切秒开。由于它没有打包环节：
1. **ESM 拦截**: Vue 作者发现，现代浏览器其实支持 ES Module (`<script type="module">` 里的 `import`)。只要你声明是 module，当浏览器读到 `import './style.css'` 时，它是浏览器底层发出的 HTTP GET 请求！所以只要我们在 Node 里架一个极轻的拦截器 HTTP 服务器即可。
2. **按需编译**: 你请求一个只会被首屏读到的 A 文件，服务器拦截请求，秒算出 A，丢回 A；A 如果引用了 B，浏览器发现后又再次发起纯请求给 B。所以他再也不用管你那些没看的美文 CDEFG（路由懒加载）！
3. **处理裸模块（`transformJs`）**: 浏览器不能识别 `import 'vue'`。真实的 Vite 使用了强大的 `es-module-lexer` 分析并把其替换为 `import '/@modules/vue'`。然后在拦截器里用 Node.js 的模块解析树寻找 `node_modules` 底下的真实 `dist` 路径进行输出。这就是插件发挥的作用。

## 预构建的奥秘 (Pre-Bundling)
> 你可能会问：那如果我的系统引用了 `lodash` 这种 CJS/UMD 没暴露出标准 ES6 Import 的包怎么装？它一被访问就发起 600 个内部碎文件的网路请求怎么办？

这就是由于浏览器网卡的**“千百条并发网络阻塞拥堵”**引起的致命伤。Vite 的解药就是在**毫秒级冷启动阶段**，顺手祭出了神兵——用 **Go 语言和并行算法** 写就的 `Esbuild`。它快如闪电，会在毫秒间预先扫描所有你在 `package.json` 中的依赖，强行给它用 Go 直接一锅端“预打包”成单个体积巨大的纯净版 ESM （`node_modules/.vite` 底下）供开发时使用。
通过这种手法既实现了神级启动速度，又完美克服了 HTTP 层面的巨量碎文件响应！

## 热替换的秘籍 (HMR)
结合我们给出的 `hmr.js` WebSocket 实现。你在 VSCode 按下 `cmd+s` 会发生什么：
1. Node 用 `chokidar` 发现文件修改（比如 `style.css` 甚至只加了个空格）
2. 通过 WebSocket 发给刚才在访问首屏首页时强制被替换和插入挂载到浏览器内存中的 `client.js`。
3. `client.js` 在浏览器接到信号：“哦？`style.css` 变脏了。”
4. 他会在背后直接把当前的修改通过 `import('./style.css?t=123910817349')` 用时间戳来彻底绕过你那顽固的浏览器缓存！从而瞬间完成屏幕无刷新热注入。（我们还对 CSS 的特别待遇做了免刷新解说）。
