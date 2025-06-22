# Vue Markdown SSE 流式输出演示

这是一个基于 Vue 3 的 Markdown 流式渲染演示项目，支持 **Server-Sent Events (SSE)** 实时流式输出，类似 ChatGPT 的打字机效果。

## ✨ 功能特性

- 🚀 **实时流式渲染** - 支持 SSE 协议的实时 Markdown 内容流式输出
- 📝 **完整 Markdown 支持** - 支持标准 Markdown 语法和 GFM 扩展
- 🧮 **数学公式渲染** - 支持 LaTeX 数学公式（行内和块级）
- 💻 **代码高亮** - 支持多种编程语言的代码块高亮
- 📊 **表格支持** - 支持 GitHub Flavored Markdown 表格
- 🎨 **打字机效果** - 带有光标动画的流式输出视觉效果
- 📱 **响应式设计** - 适配移动端和桌面端

## 🛠️ 技术栈

### 前端
- **Vue 3** - 使用 Composition API
- **Vite** - 现代化构建工具
- **mdast-util-*** - Markdown 解析和转换
- **KaTeX** - 数学公式渲染

### 后端（可选）
- **Node.js + Express** - SSE 服务端
- **Server-Sent Events** - 实时流式数据传输

## 🚀 快速开始

### 安装依赖

```bash
# 安装前端依赖
pnpm install

# 或使用 npm
npm install
```

### 启动前端开发服务器

```bash
# 启动 Vue 应用
pnpm dev

# 或使用 npm
npm run dev
```

前端应用将在 `http://localhost:5173` 启动。

### 启动 SSE 服务端（可选）

如果你想测试真实的 SSE 连接：

```bash
# 进入项目根目录，安装服务端依赖
npm install --save express

# 启动 SSE 服务端
node server-example.js
```

SSE 服务端将在 `http://localhost:3000` 启动。

## 📖 使用说明

### 模拟流式输出

1. 打开应用后，点击 **"开始模拟流式输出"** 按钮
2. 观察 Markdown 内容的实时渲染效果
3. 可以使用 **"停止输出"** 或 **"清空内容"** 按钮控制流程

### 真实 SSE 连接

1. 确保 SSE 服务端正在运行（端口 3000）
2. 点击 **"连接真实 SSE (如果有服务端)"** 按钮
3. 应用会自动连接到 SSE 服务端并接收实时数据

## 🔧 API 接口

### SSE 端点

```
GET /api/stream-markdown
```

**响应格式：**

```javascript
// 连接建立
data: {"type": "connected", "message": "SSE 连接已建立"}

// 内容流式传输
data: {"type": "content", "content": "Markdown 内容片段", "progress": 45}

// 传输完成
data: {"type": "done", "message": "流式输出完成"}
```

### 健康检查

```
GET /api/health
```

### 服务信息

```
GET /api/info
```

## 📁 项目结构

```
vue-markdown/
├── src/
│   ├── components/
│   │   ├── index.vue          # 主渲染组件
│   │   ├── code-block.vue     # 代码块组件
│   │   └── math-formula.vue   # 数学公式组件
│   ├── utils/
│   │   ├── hast-converter.js  # AST 转换工具
│   │   └── text-processors.js # 文本处理工具
│   ├── App.vue               # 主应用组件
│   └── main.js              # 应用入口
├── server-example.js         # SSE 服务端示例
├── server-package.json      # 服务端依赖配置
└── README.md               # 项目文档
```

## 🎨 核心功能实现

### 1. SSE 客户端连接

```javascript
const eventSource = new EventSource('/api/stream-markdown');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'content') {
    streamContent.value += data.content;
  }
};

eventSource.onerror = (error) => {
  console.error('SSE 连接错误:', error);
  // 自动降级到模拟流式输出
  startStreaming();
};
```

### 2. Markdown 实时渲染

```javascript
import { fromMarkdown } from "mdast-util-from-markdown";
import { toHast } from "mdast-util-to-hast";

const mdast = fromMarkdown(content, {
  extensions: [gfm(), math()],
  mdastExtensions: [gfmFromMarkdown(), mathFromMarkdown()]
});

const hast = toHast(mdast);
const vueComponent = hastToVue(hast);
```

### 3. 打字机视觉效果

```css
.typing-cursor {
  display: inline-block;
  color: #007bff;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

## 🔍 支持的 Markdown 语法

- ✅ **标题** - H1 到 H6
- ✅ **强调** - 粗体、斜体、删除线
- ✅ **列表** - 有序和无序列表
- ✅ **代码** - 行内代码和代码块
- ✅ **链接** - 普通链接和自动链接
- ✅ **图片** - 图片引用
- ✅ **表格** - GitHub Flavored Markdown 表格
- ✅ **引用** - 块引用
- ✅ **数学公式** - LaTeX 语法，行内和块级
- ✅ **任务列表** - GitHub 风格的任务列表

## 🎯 使用场景

- **实时聊天应用** - 类似 ChatGPT 的对话界面
- **文档协作** - 实时文档编辑和预览
- **直播字幕** - 实时字幕流式显示
- **代码演示** - 实时代码讲解和展示
- **教育平台** - 实时课件和公式展示

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目使用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🙏 鸣谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [mdast](https://github.com/syntax-tree/mdast) - Markdown 抽象语法树
- [KaTeX](https://katex.org/) - 数学公式渲染引擎
- [Express.js](https://expressjs.com/) - Node.js Web 框架

---

**享受流式 Markdown 渲染的乐趣！** 🎉
