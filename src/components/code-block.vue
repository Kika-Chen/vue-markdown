<template>
  <div class="code-container">
    <pre><code
        :class="codeClass"
        v-text="props.code"
    /></pre>
  </div>
</template>

<script setup>
  import { computed } from "vue"

  const props = defineProps({
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: ""
    }
  })

  const codeClass = computed(() => {
    return `language-${props.language}`
  })
</script>

<style scoped>
.code-container {
  margin: 1em 0;
  border-radius: 6px;
  overflow: hidden;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.code-container pre {
  margin: 0;
  padding: 16px;
  background: #f8f9fa;
  color: #333;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.45;
  overflow-x: auto;
}

.code-container code {
  background: transparent;
  padding: 0;
  font-size: inherit;
  color: inherit;
  word-break: normal;
  white-space: pre;
}

/* 简单的语法高亮样式 */
.language-javascript,
.language-js {
  color: #d73a49;
}

.language-python {
  color: #005cc5;
}

.language-css {
  color: #6f42c1;
}

.language-html {
  color: #e34c26;
}

.language-json {
  color: #032f62;
}
</style>
