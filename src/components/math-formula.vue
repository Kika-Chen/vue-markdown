<template>
  <span
    v-if="inline"
    class="math-inline"
    v-html="renderedMath"
  />
  <div
    v-else
    class="math-display"
    v-html="renderedMath"
  />
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  const props = defineProps({
    value: {
      type: String,
      required: true
    },
    inline: {
      type: Boolean,
      default: false
    }
  })

  const renderedMath = ref('')

  // 使用 KaTeX 渲染数学公式
  const renderMath = () => {
    try {
      // 检查是否有 KaTeX 可用
      if (typeof window !== 'undefined' && window.katex) {
        renderedMath.value = window.katex.renderToString(props.value, {
          displayMode: !props.inline,
          throwOnError: false,
          errorColor: '#cc0000'
        })
      } else {
        // 如果 KaTeX 不可用，显示原始公式
        renderedMath.value = props.inline ? `$${props.value}$` : `$$${props.value}$$`
      }
    } catch (error) {
      console.error('数学公式渲染错误:', error)
      renderedMath.value = props.inline ? `$${props.value}$` : `$$${props.value}$$`
    }
  }

  onMounted(() => {
    // 容错处理，如果 window.katex 不存在，则从 CDN 加载 KaTeX
    if (typeof window !== 'undefined' && !window.katex) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css'
      document.head.appendChild(link)

      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js'
      script.onload = renderMath
      document.head.appendChild(script)
    } else {
      renderMath()
    }
  })
</script>

<style scoped>
.math-inline {
  display: inline;
}

.math-display {
  display: block;
  text-align: center;
  margin: 1em 0;
  overflow-x: auto;
}

/* KaTeX 样式补充 */
:deep(.katex) {
  font-size: 1.1em;
}

:deep(.katex-display) {
  margin: 1em 0;
}
</style>