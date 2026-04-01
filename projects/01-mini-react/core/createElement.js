/**
 * createElement - 创建虚拟 DOM (VNode) 对象
 * 这个函数的作用与 React.createElement 完全一致，会被 Babel 转换 JSX 时调用
 * 
 * 例如: <div id="app">Hello</div>
 * 会被编译为: createElement("div", { id: "app" }, "Hello")
 *
 * @param {string} type - 节点类型，如 'div', 'span', 或一个函数组件
 * @param {object} props - 节点的属性，含 className, id 等
 * @param {...any} children - 子节点，可能是字符串也可能是其他 VNode
 * @returns {object} - 虚拟 DOM 对象
 */
export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 遍历 children，如果是对象（也就是另一个 createElement 的返回值）直接保留
      // 如果是基本类型（比如字符串/数字），需要包装成特定标识的 TEXT_ELEMENT 节点
      children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      ),
    },
  };
}

/**
 * createTextElement - 为文本节点创建特殊的虚拟 DOM
 * React 实际上不显式地包裹纯文本节点，但这样做能够统一后面的逻辑处理（不用到处写 typeof 判断）
 *
 * @param {string|number} text - 节点文本内容
 * @returns {object}
 */
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [], // 文本节点是没有子节点的
    },
  };
}
