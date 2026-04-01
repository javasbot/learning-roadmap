import { track, trigger } from './effect.js';

// 用于判断是不是 Object/Array 从而决定是不是要进入深层代理
const isObject = (val) => val !== null && typeof val === 'object';

/**
 * reactive()
 * 用于把一个普通的对象变成一个深度响应式的 Proxy 对象
 */
export function reactive(target) {
  // 边界拦截：只代理对象
  if (!isObject(target)) {
    return target;
  }

  // 实例化 Proxy
  const proxy = new Proxy(target, {
    // 拦截读取（obj.a, obj[1]）
    get(target, key, receiver) {
      // 通过 Reflect 去安全地取值，receiver 绑定正确的 this
      const res = Reflect.get(target, key, receiver);
      
      // 取值的瞬间，开始做依赖收集
      track(target, key);

      // 深层代理判断：如果取出来的值依然是个对象，那么就递归把它给包装成 reactive
      // 性能巨好：相较于 Vue2 实例化一开始就用 Object.defineProperty 把底下几千个节点全递归绑定好
      // Vue3 是懒绑定的。只有当你 obj.a.b 访问到 b 时，它此时才去对 b 包裹一层 proxy 给出去。
      if (isObject(res)) {
        return reactive(res); // Vue3 的懒代理（Lazy reactive）精髓机制
      }
      return res;
    },

    // 拦截写入 (obj.a = 2)
    set(target, key, value, receiver) {
      // 拿到老的值，做无意义更改优化的判断
      const oldValue = target[key];
      
      // 注意：一定要先去真实改值，在真实改值之后再去根据它发通知
      // 否则通知出去执行的方法读到的还会是刚才的老值
      const result = Reflect.set(target, key, value, receiver);
      
      // 如果值变了（并且不考虑 NaN 不等于自身的奇怪情况），那就把收集在小本本本上的人都叫醒
      if (oldValue !== value && (oldValue === oldValue || value === value)) {
        trigger(target, key);
      }
      return result;
    },

    // 另外还需要处理 in、delete 等各种操作才能说是完美代理
    // 这里简单实现 delete 的拦截用于触发删除属性后的界面更新
    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const result = Reflect.deleteProperty(target, key);
      if (hadKey && result) {
        trigger(target, key);
      }
      return result;
    }
  });

  return proxy;
}
