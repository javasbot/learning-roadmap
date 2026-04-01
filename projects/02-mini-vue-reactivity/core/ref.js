import { track, trigger, activeEffect } from './effect.js';
import { reactive } from './reactive.js';

/**
 * 为什么需要 ref？
 * 因为 JavaScript 中的基本原生类型（如 string, number）在传递时是按值传递的！
 * Proxy 这个功能，死活也只能代理基于引用的 Object。
 * 所以如果是: let count = 0; 这里是建立不了任何拦截机制的（它不能传址给 Proxy）。
 * 想要让基本类型拥有响应性，只有硬包一层对象，并在 get value() 上做手脚！
 */

class RefImpl {
  constructor(value) {
    this._value = value;
    // 老规矩，只有你传个 Object 给 ref({ a: 1 })，我也得把底层自动转成 reactive
    this._value = isObject(value) ? reactive(value) : value;
    
    // 手动实现类似 effect 里的 targetMap，因为 ref 自己就是一个对象，它的值永远是在 "value" 这里发生
    this.dep = new Set();
  }

  // 利用类自带的 get 访问器拦截取值操作
  get value() {
    // 手动 track，由于我们在 ref.js 里面拿不到那个庞大的 targetMap 去 set/get，这里直接维护实例身上的 this.dep
    if (activeEffect) {
      this.dep.add(activeEffect);
      activeEffect.deps.push(this.dep); 
    }
    return this._value;
  }

  // 拦截赋值操作
  set value(newValue) {
    // 当值发生变化时
    if (newValue !== this._value) {
      // 依旧是如果他塞了个对象进来，需要转换底层的值
      this._value = isObject(newValue) ? reactive(newValue) : newValue;
      
      // 然后手动 trigger
      this.dep.forEach(effect => {
        if (effect !== activeEffect) {
          if (effect.options.scheduler) effect.options.scheduler(effect);
          else effect();
        }
      });
    }
  }
}

// 辅助工具判断
const isObject = (val) => val !== null && typeof val === 'object';

// 对外暴露的方法就是把传的参数丢给包装类即可
export function ref(value) {
  return new RefImpl(value);
}
