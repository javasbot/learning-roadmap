import { effect, track, trigger } from './effect.js';

/**
 * computed - 计算属性底层实现
 *
 * 它的核心精髓是什么？
 * 1. Laziness（它是个懒狗，必须要你访问这个 computed 的那一下才会去计算）
 * 2. 也是最重要的，缓存（Dirty 脏值检测）。
 *   只要它引用的底层响应式状态不改变，你读取 1 万次它这辈子也仅仅只运算第一次，以后直接把老结果扔给你。
 */
export function computed(getter) {
  let value;         // 它的缓存池子
  let dirty = true;  // 这个红绿灯：一开始没计算过所以必定脏，需要算一次

  // 我们使用带有 scheduler（调度器）的 effect
  // computed 原理就是把自己里面的 getter 用 effect 包装一番！
  const effectFn = effect(getter, {
    lazy: true,      // effect 函数你别猴急，这里面不能一开始就直接跑！必须等有人去 computed.value 的时候我在 get() 里面命令你跑。
    scheduler() {
      // 【高能预警】
      // 什么时候 scheduler 会被触发？？
      // getter 大概率会包含： reactive.a + reactive.b。
      // 所以当上游的 reactive 数据被人改掉、试图 trigger 的时候，被叫醒的正是我们这个 scheduler！！
      
      // 哦，你把上游依赖的值在别的地方偷偷改了导致我这被叫醒了是吧？
      // 可以，我不立刻算（浪费性能），我只反手把这个红绿灯再次亮起来，说明以前算好的池子失效变“脏”了。
      if (!dirty) {
        dirty = true;
        
        // 我们这是 computed 变量啊！我们本质上也是个被其他人监听的变量啊。
        // 所以上游改了，我们自己也得向看着我们脸色的人群（下游）大吼一嗓子：兄弟们，你们依赖的我的 value 也许变了哈！触发一下重新渲染！
        trigger(obj, 'value');
      }
    }
  });

  // 返回出去暴露给用户的就是个类似于 ref 的东西。
  const obj = {
    get value() {
      // 如果灯是脏的，说明这是从来没计算过、或者是上次上游通知我们去重新算计算还没做的。
      if (dirty) {
        value = effectFn(); // 开始强制运算（跑到真正的用户写的 getter 里去了）
        dirty = false;      // 灯变绿变不脏，短时间内可以疯狂用 value 的池子了
      }
      
      // 作为下游最关键的一步，我们在被真正的最终组件或者谁读取的时候，也要告诉他们把我塞进他们的 track 日志本本里
      track(obj, 'value');
      
      return value;
    }
  };

  return obj;
}
