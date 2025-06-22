// SSE 服务端示例
// 运行命令: node server-example.js
// 然后访问 http://localhost:3000

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// 静态文件服务 (如果需要)
app.use(express.static('dist'));

// 设置 CORS 头
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 示例 Markdown 内容
const sampleMarkdownContent = `# 实时 SSE Markdown 流式输出

这是从 **真实 SSE 服务端** 流式传输的 Markdown 内容！

## 技术栈

- **后端**: Node.js + Express
- **前端**: Vue 3 + Vite
- **流式协议**: Server-Sent Events (SSE)

### 代码演示

\`\`\`javascript
// SSE 客户端连接示例
const eventSource = new EventSource('/api/stream-markdown');

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('接收到数据:', data);
};
\`\`\`

### 数学公式

这里是爱因斯坦的质能方程：$E = mc^2$

复杂的数学公式：

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

### 实时特性

✅ 支持实时流式输出  
✅ 自动重连机制  
✅ 错误处理  
✅ 状态指示器  

> 这个演示展示了如何使用 SSE 实现类似 ChatGPT 那样的打字机效果！

**流式输出完成！** 🎉`;

// SSE 流式输出端点
app.get('/api/stream-markdown', (req, res) => {
  console.log('新的 SSE 连接');
  
  // 设置 SSE 响应头
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // 发送初始连接确认
  res.write('data: {"type": "connected", "message": "SSE 连接已建立"}\n\n');

  // 模拟流式输出
  const content = sampleMarkdownContent;
  let index = 0;
  
  const streamInterval = setInterval(() => {
    if (index < content.length) {
      // 每次发送一个或几个字符
      const chunk = content.slice(index, index + Math.floor(Math.random() * 3) + 1);
      index += chunk.length;
      
      // 发送内容块
      const data = {
        type: 'content',
        content: chunk,
        progress: Math.round((index / content.length) * 100)
      };
      
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } else {
      // 发送完成信号
      res.write('data: {"type": "done", "message": "流式输出完成"}\n\n');
      clearInterval(streamInterval);
      res.end();
    }
  }, 50 + Math.random() * 100); // 随机延迟，模拟真实场景

  // 处理客户端断开连接
  req.on('close', () => {
    console.log('SSE 连接已断开');
    clearInterval(streamInterval);
  });
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'SSE 服务运行正常'
  });
});

// 获取服务信息
app.get('/api/info', (req, res) => {
  res.json({
    name: 'SSE Markdown Stream Server',
    version: '1.0.0',
    endpoints: {
      stream: '/api/stream-markdown',
      health: '/api/health',
      info: '/api/info'
    },
    features: [
      '实时 Markdown 流式输出',
      '自动错误处理',
      'CORS 支持',
      '连接状态监控'
    ]
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 SSE 服务端已启动`);
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`🔗 SSE 端点: http://localhost:${PORT}/api/stream-markdown`);
  console.log(`💚 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`📝 服务信息: http://localhost:${PORT}/api/info`);
  console.log(`\n使用 Ctrl+C 停止服务`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n⏹️  正在关闭服务器...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  正在关闭服务器...');
  process.exit(0);
}); 