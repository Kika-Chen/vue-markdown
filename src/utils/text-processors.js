import { h } from "vue"
import MathFormula from "../components/math-formula.vue"


/**
 * 处理方括号数学公式格式 [ formula ]
 * @param {string} text - 要处理的文本
 * @returns {string|Array} 处理后的文本或组件数组
 */
export function processMathInBrackets(text) {
  if (!text || typeof text !== 'string') return text

  // 匹配方括号中的数学公式，支持多行
  const mathBracketRegex = /\[\s*([^[\]]+(?:\n[^[\]]*)*)\s*\]/g
  const parts = []
  let lastIndex = 0

  text.replace(mathBracketRegex, (match, formula, offset) => {
    // 添加匹配前的文本
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset))
    }

    // 清理公式内容，移除多余的空白
    const cleanFormula = formula.trim().replace(/\s+/g, ' ')

    // 创建数学公式组件
    parts.push(h(MathFormula, {
      value: cleanFormula,
      inline: true
    }))

    lastIndex = offset + match.length
    return match
  })

  // 添加剩余文本
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

/**
 * @param {string} text - 要处理的文本
 * @param {string|number} messageIndex - 消息索引
 * @returns {string|Array} 处理后的文本或组件数组
 */
export function processTextContent(text) {
  if (!text || typeof text !== 'string') return text
  return processMathInBrackets(text)
}
