import { h } from "vue"
import CodeBlock from "../components/code-block.vue"
import MathFormula from "../components/math-formula.vue"
import { processTextContent } from "./text-processors.js"

/**
 * 提取节点中的文本内容
 * @param {Object} node - 节点对象
 * @returns {string} 提取的文本内容
 */
export function extractTextFromNode(node) {
  if (node.type === 'text') return node.value
  if (node.children) {
    return node.children.map(child => extractTextFromNode(child)).join('')
  }
  return ''
}

/**
 * 将 hast 节点转换为 Vue h 函数
 * @param {Object} node - hast节点
 * @param {string|number} messageIndex - 消息索引
 * @returns {Object|Array|string|null} Vue组件或文本
 */
export function hastToVue(node, messageIndex) {
  if (!node) return null

  // 处理文本节点
  if (node.type === "text") {
    return processTextContent(node.value, messageIndex)
  }

  // 处理元素节点
  if (node.type === "element") {
    const { tagName, properties = {}, children = [] } = node

    // 处理数学公式 - 行内数学公式
    if (tagName === 'code' && properties.className?.includes('language-math') && properties.className?.includes('math-inline')) {
      const mathText = extractTextFromNode(node)
      return h(MathFormula, {
        value: mathText,
        inline: true
      })
    }

    // 处理数学公式 - 块级数学公式和代码块
    if (tagName === 'pre') {
      const codeNode = children.find(child => child.tagName === 'code')
      if (codeNode) {
        const codeText = extractTextFromNode(codeNode)

        // 检查是否是数学公式
        if (codeNode.properties?.className?.includes('language-math') && codeNode.properties?.className?.includes('math-display')) {
          return h(MathFormula, {
            value: codeText,
            inline: false
          })
        }

        // 普通代码块
        const language = codeNode.properties?.className?.[0]?.replace('language-', '') || ''
        return h(CodeBlock, {
          code: codeText,
          language: language
        })
      }
    }

    // 递归处理子节点
    const childNodes = children.map((child) => hastToVue(child, messageIndex)).filter(Boolean)
    return h(tagName, properties, childNodes)
  }

  // 处理根节点
  if (node.type === "root") {
    return h("div", {}, node.children?.map((child) => hastToVue(child, messageIndex)).filter(Boolean) || [])
  }

  // 处理其他类型节点
  console.warn(`未处理的 hast 节点类型: ${node.type}`, node)
  return null
}