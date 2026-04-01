/**
 * 微前端基建 - JS Proxy 沙箱系统
 * 面试常考：如何防止子应用去给 window 上挂载变量的时候污染主应用？
 */

export class ProxySandbox {
  constructor(name) {
    this.name = name; // 沙箱的名字
    this.active = false; // 是否处于激活状态
    
    // 我们捏造一个假的 window，给子应用霍霍
    this.fakeWindow = Object.create(null);

    // 核心拦截器：所有对 window 的读写都会走这里
    this.proxy = new Proxy(this.fakeWindow, {
      
      // 当子应用要向 window.xxx 写入内容的时候
      set: (target, prop, value) => {
        if (this.active) {
          // 只写到自己的假 window 上，绝不触碰真实的浏览器 window
          target[prop] = value;
        }
        return true;
      },

      // 当子应用要从 window.xxx 读取内容的时候
      get: (target, prop) => {
        // 白名单：有些原生对象或者方法不能隔离，比如 document, location, alert 等
        if (prop === 'document' || prop === 'location' || prop === 'Math') {
          return window[prop];
        }
        
        // 核心逃逸绑定：如果获取的是类似 setTimeout 原生 window 对象上的函数
        // 如果直接返回，执行时的 this 是 fakeWindow 会报错 `Illegal invocation`。必须把 this 绑死在原生的 window 上！
        const value = prop in target ? target[prop] : window[prop];
        if (typeof value === 'function' && !value.prototype) {
          return value.bind(window);
        }

        return value;
      },

      has: (target, prop) => {
        return prop in target || prop in window;
      }
    });
  }

  // qiankun 等微前端框架的生命周期钩子
  activeSandbox() {
    this.active = true;
  }

  deactivateSandbox() {
    this.active = false;
  }
}
