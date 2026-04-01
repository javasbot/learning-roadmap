import { deletions } from './render.js';

/**
 * 核心的 Diff 和调和算法（Reconciler）
 * 将老 fiber 节点与新产生的 React Elements 进行对比
 * 生成新的 Fiber 链表结构，兵打上用于 commit 阶段的 effectTag (更新、删除、插入)
 *
 * @param {object} wipFiber - 正在处理的 Fiber 父节点
 * @param {array} elements - 这个组件对应的虚拟 DOM 数组（即它的新 children）
 */
export function reconcileChildren(wipFiber, elements) {
  let index = 0;
  
  // 如果当前父节点存在备胎 alternate (老版本)，则拿到它的第一个旧孩子
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  
  // 保存上一轮循环产生的新 fiber (作为兄弟节点的左侧)
  let prevSibling = null;

  // 遍历所有新的 children，同时对比旧的 children（同层对比）
  while (
    index < elements.length ||
    oldFiber != null // 即便是新元素遍历完了，老元素如果还有，就说明需要删除
  ) {
    const element = elements[index];
    let newFiber = null;

    // TODO: 目前为了简单，直接通过类型对比（严格来讲 React 这里会去比较 key，以实现 O(n) 的列表复用）
    const sameType = oldFiber && element && element.type == oldFiber.type;

    /** 1. UPDATE 策略：类型相同，复用老的 DOM 节点，只需要更新 properties **/
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,     // 继承核心：直接拿老节点的实车 DOM 引用
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",   // 打上更新标记
      };
    }

    /** 2. PLACEMENT 策略：存在新节点，但类型和老的对不上（甚至老的不存在），说明是全新的，需要插入 **/
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,             // 不复用原生 DOM，得重新创建
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }

    /** 3. DELETION 策略：类型不同且存在老节点，说明老节点作废了，需要从界面中拔掉 **/
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber); // 要删掉的不是新树节点，是老树的 DOM，推入单独数组 commit 时集中处理
    }

    // 老链表指针继续向右挪
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // 挂载新的链表指针
    if (index === 0) {
      // 如果是第一个孩子，把它作为父节点的 child
      wipFiber.child = newFiber;
    } else if (element) {
      // 否则，把它作为前一个元素的 sibling
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
