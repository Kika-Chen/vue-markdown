<template>
  <div class="markdown-body">
    <component :is="renderedContent" />
  </div>
</template>

<script setup>
  import { toHast } from "mdast-util-to-hast"
  import { ref, h, watch } from "vue"
  import { math } from 'micromark-extension-math'
  import { fromMarkdown } from "mdast-util-from-markdown"
  import { mathFromMarkdown } from 'mdast-util-math'
  import { gfm } from "micromark-extension-gfm"
  import { gfmFromMarkdown } from "mdast-util-gfm"
  import { hastToVue } from "../utils/hast-converter.js"

  const props = defineProps({
    content: {
      type: String,
      required: true
    },
    messageIndex: {
      type: [String, Number],
      default: 0
    }
  })

  const renderedContent = ref(null)

  watch(
    () => props.content,
    (newVal) => {
      if (!newVal) {
        renderedContent.value = null
        return
      }

      try {
        const mdast = fromMarkdown(newVal, {
          extensions: [gfm(), math()],
          mdastExtensions: [gfmFromMarkdown(), mathFromMarkdown()]
        })

        // 使用 hast 进行渲染
        const hast = toHast(mdast)
        const vueComponent = hastToVue(hast, props.messageIndex)
        renderedContent.value = vueComponent
      } catch (error) {
        console.error("解析 markdown 时出错:", error)
        renderedContent.value = h("div", { style: "color: red;" }, `解析错误: ${error.message}`)
      }
    },
    { immediate: true }
  )
</script>

<style scoped>
.stream-container {
  width: 100%;
  overflow-wrap: break-word;
}
</style>
