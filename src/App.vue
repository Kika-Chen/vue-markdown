<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import StreamRender from './components/index.vue'

const streamContent = ref('')
const isStreaming = ref(false)
const eventSource = ref(null)

// 模拟的 markdown 内容，用于流式输出
const sampleMarkdown = `# 欢迎使用 SSE 流式输出 Markdown

这是一个演示 **Server-Sent Events (SSE)** 流式输出 Markdown 内容的例子。

## 功能特性

1. **实时流式渲染** - 内容会逐步显示
2. **支持复杂 Markdown** - 包括代码块、数学公式等
3. **Vue 3 响应式** - 基于 Composition API

### 代码示例

这里是一个 JavaScript 代码块：

\`\`\`javascript
function streamMarkdown() {
  const eventSource = new EventSource('/api/stream');
  
  eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('收到数据:', data);
  };
  
  eventSource.onerror = function(error) {
    console.error('SSE 连接错误:', error);
  };
}
\`\`\`

### 数学公式支持

这里是一个行内数学公式：$E = mc^2$

这是一个块级数学公式：

$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$

### 表格支持

| 功能 | 支持状态 | 说明 |
|------|----------|------|
| 流式输出 | ✅ | 支持 SSE |
| 代码高亮 | ✅ | 使用 highlight.js |
| 数学公式 | ✅ | 使用 KaTeX |
| 表格 | ✅ | GFM 扩展 |

### 列表支持

- 无序列表项目 1
- 无序列表项目 2
  - 嵌套项目 1
  - 嵌套项目 2

1. 有序列表项目 1  
2. 有序列表项目 2
3. 有序列表项目 3

> 这是一个引用块，用于展示重要信息。

### 结语

通过 SSE 流式输出，我们可以实现：

- 实时的内容渲染
- 更好的用户体验
- 类似 ChatGPT 的打字机效果

**感谢您的观看！** 🎉`

// 模拟 SSE 流式输出
const startStreaming = () => {
  if (isStreaming.value) return
  
  isStreaming.value = true
  streamContent.value = ''
  
  // 模拟 SSE 数据流
  const words = sampleMarkdown.split('')
  let index = 0
  
  const streamInterval = setInterval(() => {
    if (index < words.length) {
      streamContent.value += words[index]
      index++
    } else {
      clearInterval(streamInterval)
      isStreaming.value = false
    }
  }, 50) // 每50ms输出一个字符
}

// 停止流式输出
const stopStreaming = () => {
  isStreaming.value = false
  if (eventSource.value) {
    eventSource.value.close()
  }
}

// 清空内容
const clearContent = () => {
  streamContent.value = ''
  stopStreaming()
}

// 使用真实的 SSE 连接（如果有服务端）
const connectSSE = () => {
  try {
    eventSource.value = new EventSource('/api/stream-markdown')
    
    eventSource.value.onopen = () => {
      console.log('SSE 连接已建立')
      isStreaming.value = true
    }
    
    eventSource.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'content') {
        streamContent.value += data.content
      } else if (data.type === 'done') {
        isStreaming.value = false
        eventSource.value.close()
      }
    }
    
    eventSource.value.onerror = (error) => {
      console.error('SSE 连接错误:', error)
      isStreaming.value = false
      // 如果真实的 SSE 连接失败，使用模拟的流式输出
      startStreaming()
    }
  } catch (error) {
    console.error('无法建立 SSE 连接，使用模拟流式输出:', error)
    startStreaming()
  }
}

onMounted(() => {
  // 页面加载时自动开始演示
  setTimeout(startStreaming, 1000)
})

onUnmounted(() => {
  stopStreaming()
})
</script>

<template>
  <div class="app-container">
    <div class="controls">
      <h1>SSE 流式输出 Markdown 演示</h1>
      <div class="button-group">
        <button 
          @click="startStreaming" 
          :disabled="isStreaming"
          class="btn btn-primary"
        >
          {{ isStreaming ? '流式输出中...' : '开始模拟流式输出' }}
        </button>
        <button 
          @click="connectSSE" 
          :disabled="isStreaming"
          class="btn btn-secondary"
        >
          连接真实 SSE (如果有服务端)
        </button>
        <button 
          @click="stopStreaming" 
          :disabled="!isStreaming"
          class="btn btn-warning"
        >
          停止输出
        </button>
        <button 
          @click="clearContent" 
          class="btn btn-danger"
        >
          清空内容
        </button>
      </div>
      <div class="status">
        <span :class="{ 'streaming': isStreaming, 'idle': !isStreaming }">
          {{ isStreaming ? '● 正在流式输出' : '○ 空闲状态' }}
        </span>
        <span class="word-count">字符数: {{ streamContent.length }}</span>
      </div>
    </div>
    
    <div class="content-container">
      <StreamRender 
        class="markdown-body border-l-[1px] border-[#DFE1FC] pl-[12px]" 
        :content="streamContent" 
        :messageIndex="0"
      />
      
      <!-- 打字机光标效果 -->
      <span v-if="isStreaming" class="typing-cursor">|</span>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.controls h1 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover:not(:disabled) {
  background: #e0a800;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.status {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 14px;
}

.streaming {
  color: #28a745;
  font-weight: 600;
}

.idle {
  color: #6c757d;
}

.word-count {
  color: #6c757d;
}

.content-container {
  position: relative;
  min-height: 400px;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.typing-cursor {
  display: inline-block;
  color: #007bff;
  font-weight: bold;
  animation: blink 1s infinite;
  font-size: 16px;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }
  
  .controls {
    padding: 15px;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .status {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
