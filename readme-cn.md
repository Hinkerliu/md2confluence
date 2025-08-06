# markdown2confluence

[![构建状态][travis-image]][travis-url]
[![NPM 版本][npm-image]][npm-url]
[![下载量][downloads-image]][downloads-url]
[![依赖状态][david-image]][david-url]

[npm-image]: https://img.shields.io/npm/v/markdown2confluence.svg?style=flat-square
[npm-url]: https://npmjs.org/package/markdown2confluence
[downloads-image]: http://img.shields.io/npm/dm/markdown2confluence.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/markdown2confluence
[david-image]: http://img.shields.io/david/chunpu/markdown2confluence.svg?style=flat-square
[david-url]: https://david-dm.org/chunpu/markdown2confluence

**将 Markdown 转换为 Confluence Wiki 标记语言** - 一个强大的 Node.js 工具，可以将您的 Markdown 文档转换为 Confluence 兼容的标记语言。

## ✨ 特性

- **完全兼容 Confluence** - 支持 Confluence 9.2.4+ 和现代版本
- **全面的语法支持** - 标题、代码块、表格、列表、链接、图片等
- **扩展的语言支持** - 20+ 种编程语言的语法高亮
- **多种使用方式** - CLI 工具、浏览器界面或 Node.js 库
- **智能代码块处理** - 自动行号和长代码块折叠
- **现代主题支持** - 针对更好可读性优化的主题

## 🚀 安装

### 全局安装（CLI）
```bash
npm install -g markdown2confluence
```

### 本地安装（库）
```bash
npm install markdown2confluence
```

## 📖 使用方法

### 命令行界面
```bash
# 转换 markdown 文件
markdown2confluence input.md

# 输出到文件
markdown2confluence input.md > output.txt
```

### Web 服务器 (全新功能!)
部署为Web服务，支持团队协作：

```bash
# 启动Web服务器
npm start

# 或使用自定义端口
PORT=3000 npm start

# 部署到生产服务器
chmod +x deploy.sh
./deploy.sh
```

**Web界面特性：**
- 🌐 **浏览器转换** - 无需安装，直接使用
- ⚡ **实时预览** - 输入即转换，所见即所得
- 📋 **一键复制** - 转换结果一键复制到剪贴板
- 🎨 **现代响应式界面** - 支持桌面和移动设备
- 🔒 **安全本地处理** - 数据不发送到外部服务器

**访问地址：**
- Web界面：`http://localhost:8092` （或您的服务器IP）
- 健康检查：`http://localhost:8092/health`
- API接口：`POST /api/convert`，JSON格式：`{"markdown": "内容"}`

### 浏览器界面
试试在线转换器：[http://chunpu.github.io/markdown2confluence/browser/](http://chunpu.github.io/markdown2confluence/browser/)

### Node.js 库
```javascript
const md2confluence = require('markdown2confluence');

const markdown = '# Hello World\nThis is **bold** text.';
const confluenceMarkup = md2confluence(markdown);
console.log(confluenceMarkup);
// 输出: h1. Hello World\nThis is *bold* text.
```

## 🔧 支持的语法

### 标题
```markdown
# H1 标题        →  h1. H1 标题
## H2 标题       →  h2. H2 标题
### H3 标题      →  h3. H3 标题
```

### 文本格式
```markdown
**粗体文本**       →  *粗体文本*
*斜体文本*        →  _斜体文本_
~~删除线~~        →  -删除线-
`行内代码`        →  {{行内代码}}
```

### 代码块
```markdown
```javascript
console.log('Hello');
```
```

转换为：
```
{code:language=javascript|linenumbers=true|theme=Confluence}
console.log('Hello');
{code}
```

### 支持的语言
- **Web 开发**: `javascript`、`typescript`、`html`、`css`、`json`、`yaml`
- **后端开发**: `python`、`java`、`csharp`、`php`、`ruby`、`go`、`rust`
- **移动开发**: `swift`、`kotlin`、`dart`
- **系统开发**: `cpp`、`bash`、`powershell`、`sql`
- **其他**: `groovy`、`scala`、`perl`、`erlang`、`coldfusion`

### 列表
```markdown
- 项目 1            →  * 项目 1
- 项目 2            →  * 项目 2

1. 有序             →  # 有序
2. 列表             →  # 列表
```

### 表格
```markdown
| 表头 1 | 表头 2 |
|--------|--------|
| 单元格 1 | 单元格 2 |
```

转换为：
```
||表头 1||表头 2
|单元格 1|单元格 2
```

### 链接和图片
```markdown
[链接文本](url)     →  [链接文本|url]
![替代文本](img)    →  !img!
```

### 引用块
```markdown
> 引用文本          →  {quote}引用文本{quote}
```

## 🔄 从旧版本迁移

如果您正在从旧版本升级，请注意这些改进：

- **增强的语言支持** - 新增 TypeScript、Go、Rust、Swift、Kotlin、Dart
- **改进的代码主题** - 现代 Confluence 主题支持
- **更好的空格处理** - 优化的空白字符处理
- **Confluence 9.2.4+ 兼容性** - 针对最新 Confluence 版本更新

## 🧪 测试

运行测试套件以验证功能：

```bash
npm test
```

测试套件包含 15+ 个全面的测试，涵盖：
- 所有标题级别（h1-h6）
- 代码块语言支持
- 边缘情况和空白字符处理
- 表格和列表转换

## 🛠️ 开发和部署

### Web 服务器部署
```bash
# 快速启动
npm start                    # 在8092端口启动服务器

# 后台运行
nohup npm start > server.log 2>&1 &

# 自动化生产部署
chmod +x deploy.sh
./deploy.sh                  # 自动配置并启动服务

# 使用 PM2 进行生产部署
npm install -g pm2
pm2 start server.js --name markdown2confluence
```

### 构建浏览器版本
```bash
npm run build
```

### 单独的构建步骤
```bash
npm run build-html    # 编译 Jade 模板
npm run build-js      # 使用 webpack 打包 JavaScript
```

### Docker 部署 (可选)
```bash
# 构建 Docker 镜像
docker build -t markdown2confluence .

# 运行容器
docker run -p 8092:8092 -d markdown2confluence
```

### 生产环境考虑
- **反向代理**: 使用 Nginx/Apache 进行 SSL 和负载均衡
- **进程管理**: 使用 PM2 或 systemd 进行自动重启
- **安全配置**: 为端口 8092 配置防火墙规则
- **监控**: 通过 `/health` 端点检查服务状态

## 📚 文档

- [Confluence Wiki 标记语言参考](https://confluence.atlassian.com/display/CONF42/Confluence+Wiki+Markup)
- [Confluence 9.2+ 文档](https://confluence.atlassian.com/doc/confluence-wiki-markup-251003035.html)

## 🐛 演示

![演示预览](./preview.png)

在浏览器中试用您的 markdown 转换：[在线演示](http://chunpu.github.io/markdown2confluence/browser/)

## 📄 许可证

[![License][license-image]][license-url]

[travis-image]: https://img.shields.io/travis/chunpu/markdown2confluence.svg?style=flat-square
[travis-url]: https://travis-ci.org/chunpu/markdown2confluence
[license-image]: http://img.shields.io/npm/l/markdown2confluence.svg?style=flat-square
[license-url]: #