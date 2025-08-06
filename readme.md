# markdown2confluence

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-image]][david-url]

[npm-image]: https://img.shields.io/npm/v/markdown2confluence.svg?style=flat-square
[npm-url]: https://npmjs.org/package/markdown2confluence
[downloads-image]: http://img.shields.io/npm/dm/markdown2confluence.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/markdown2confluence
[david-image]: http://img.shields.io/david/chunpu/markdown2confluence.svg?style=flat-square
[david-url]: https://david-dm.org/chunpu/markdown2confluence

**Convert Markdown to Confluence Wiki Markup** - A powerful Node.js tool that transforms your Markdown documents into Confluence-compatible markup.

## ✨ Features

- **Full Confluence Compatibility** - Works with Confluence 9.2.4+ and modern versions
- **Comprehensive Syntax Support** - Headings, code blocks, tables, lists, links, images, and more
- **Extended Language Support** - 20+ programming languages with syntax highlighting
- **Multiple Usage Options** - CLI tool, browser interface, or Node.js library
- **Smart Code Block Handling** - Automatic line numbering and collapsing for long blocks
- **Modern Theme Support** - Optimized themes for better readability

## 🚀 Installation

### Global Installation (CLI)
```bash
npm install -g markdown2confluence
```

### Local Installation (Library)
```bash
npm install markdown2confluence
```

## 📖 Usage

### Command Line Interface
```bash
# Convert a markdown file
markdown2confluence input.md

# Output to file
markdown2confluence input.md > output.txt
```

### Web Server (NEW!)
Deploy as a web service for team collaboration:

```bash
# Start web server
npm start

# Or run with custom port
PORT=3000 npm start

# Deploy to production server
chmod +x deploy.sh
./deploy.sh
```

**Web Interface Features:**
- 🌐 **Browser-based conversion** - No installation required
- ⚡ **Real-time preview** - See results as you type
- 📋 **One-click copy** - Copy results to clipboard instantly
- 🎨 **Modern responsive UI** - Works on desktop and mobile
- 🔒 **Secure local processing** - No data sent to external servers

**Access URLs:**
- Web Interface: `http://localhost:8092` (or your server IP)
- Health Check: `http://localhost:8092/health`
- API Endpoint: `POST /api/convert` with JSON payload `{"markdown": "content"}`

### Browser Interface
Try the live converter: [http://chunpu.github.io/markdown2confluence/browser/](http://chunpu.github.io/markdown2confluence/browser/)

### Node.js Library
```javascript
const md2confluence = require('markdown2confluence');

const markdown = '# Hello World\nThis is **bold** text.';
const confluenceMarkup = md2confluence(markdown);
console.log(confluenceMarkup);
// Output: h1. Hello World\nThis is *bold* text.
```

## 🔧 Supported Syntax

### Headings
```markdown
# H1 Heading        →  h1. H1 Heading
## H2 Heading       →  h2. H2 Heading
### H3 Heading      →  h3. H3 Heading
```

### Text Formatting
```markdown
**bold text**       →  *bold text*
*italic text*       →  _italic text_
~~strikethrough~~   →  -strikethrough-
`inline code`       →  {{inline code}}
```

### Code Blocks
```markdown
```javascript
console.log('Hello');
```
```

Converts to:
```
{code:language=javascript|linenumbers=true|theme=Confluence}
console.log('Hello');
{code}
```

### Supported Languages
- **Web**: `javascript`, `typescript`, `html`, `css`, `json`, `yaml`
- **Backend**: `python`, `java`, `csharp`, `php`, `ruby`, `go`, `rust`
- **Mobile**: `swift`, `kotlin`, `dart`
- **Systems**: `cpp`, `bash`, `powershell`, `sql`
- **Others**: `groovy`, `scala`, `perl`, `erlang`, `coldfusion`

### Lists
```markdown
- Item 1            →  * Item 1
- Item 2            →  * Item 2

1. Numbered         →  # Numbered
2. List             →  # List
```

### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

Converts to:
```
||Header 1||Header 2
|Cell 1|Cell 2
```

### Links and Images
```markdown
[Link text](url)    →  [Link text|url]
![Alt text](img)    →  !img!
```

### Block Quotes
```markdown
> Quote text        →  {quote}Quote text{quote}
```

## 🔄 Migration from Legacy Versions

If you're upgrading from an older version, note these improvements:

- **Enhanced Language Support** - Added TypeScript, Go, Rust, Swift, Kotlin, Dart
- **Improved Code Themes** - Modern Confluence theme support
- **Better Spacing** - Optimized whitespace handling
- **Confluence 9.2.4+ Compatibility** - Updated for latest Confluence versions

## 🧪 Testing

Run the test suite to verify functionality:

```bash
npm test
```

The test suite includes 15+ comprehensive tests covering:
- All heading levels (h1-h6)
- Code block language support
- Edge cases and whitespace handling
- Table and list conversions

## 🛠️ Development & Deployment

### Web Server Deployment
```bash
# Quick start
npm start                    # Start server on port 8092

# Background deployment
nohup npm start > server.log 2>&1 &

# Automated production deployment
chmod +x deploy.sh
./deploy.sh                  # Auto-configures and starts service

# Using PM2 for production
npm install -g pm2
pm2 start server.js --name markdown2confluence
```

### Building the Browser Version
```bash
npm run build
```

### Individual Build Steps
```bash
npm run build-html    # Compile Jade templates
npm run build-js      # Bundle JavaScript with webpack
```

### Docker Deployment (Optional)
```bash
# Build Docker image
docker build -t markdown2confluence .

# Run container
docker run -p 8092:8092 -d markdown2confluence
```

### Production Considerations
- **Reverse Proxy**: Use Nginx/Apache for SSL and load balancing
- **Process Management**: Use PM2 or systemd for auto-restart
- **Security**: Configure firewall rules for port 8092
- **Monitoring**: Check `/health` endpoint for service status

## 📚 Documentation

- [Confluence Wiki Markup Reference](https://confluence.atlassian.com/display/CONF42/Confluence+Wiki+Markup)
- [Confluence 9.2+ Documentation](https://confluence.atlassian.com/doc/confluence-wiki-markup-251003035.html)

## 🐛 Demo

![Demo Preview](./preview.png)

Try converting your markdown in the browser: [Live Demo](http://chunpu.github.io/markdown2confluence/browser/)

## 📄 License

[![License][license-image]][license-url]

[travis-image]: https://img.shields.io/travis/chunpu/markdown2confluence.svg?style=flat-square
[travis-url]: https://travis-ci.org/chunpu/markdown2confluence
[license-image]: http://img.shields.io/npm/l/markdown2confluence.svg?style=flat-square
[license-url]: #
