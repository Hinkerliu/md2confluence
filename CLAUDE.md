# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `markdown2confluence`, a Node.js tool that converts Markdown to Confluence Wiki Markup. It provides both a command-line interface and a browser-based converter.

## Common Commands

### Testing
```bash
npm test
# Runs the basic test suite in test.js
```

### Building
```bash
npm run build
# Builds both HTML and JavaScript bundles

npm run build-html
# Compiles Jade templates to HTML

npm run build-js  
# Webpack bundles browser/app.js to browser/bundle.js
```

### Server Deployment
```bash
npm start
# Starts the HTTP server on port 8092

npm run server
# Alternative command to start server

./deploy.sh
# Automated deployment script for production
```

### Usage
```bash
# CLI usage
markdown2confluence input.md

# Or globally after npm install -g
markdown2confluence markdown.md
```

## Architecture

### Core Components

- **index.js**: Main conversion engine that extends marked.js renderer with Confluence markup
- **bin/markdown2confluence.js**: CLI wrapper that reads files and outputs converted markup
- **server.js**: Express HTTP server for web-based conversion service
- **browser/server.html**: Modern web interface with Bootstrap UI
- **browser/app-server.js**: Client-side JavaScript for server communication
- **test.js**: Comprehensive test suite with 15+ test cases

### Server Architecture

The web server (server.js) provides:
1. **Static file serving** - Serves the browser interface
2. **REST API endpoint** - POST /api/convert for markdown conversion
3. **Health check** - GET /health for service monitoring
4. **Error handling** - Graceful error responses and logging

### Deployment Structure

```
Production Deployment:
├── server.js              # Express server (port 8092)
├── browser/server.html    # Modern web UI
├── browser/app-server.js  # Client-side logic
├── deploy.sh             # Automated deployment script
├── DEPLOY.md             # Deployment documentation
└── .env                  # Environment configuration
```

### Key Implementation Details

The converter works by:
1. Using `marked` library as the Markdown parser
2. Implementing a custom `Renderer` that overrides marked's default HTML output methods
3. Converting each Markdown element to its Confluence Wiki Markup equivalent

#### Language Support for Code Blocks
Supported languages are mapped in `langMap` (index.js:19-26):
- Standard languages: actionscript3, bash, csharp, coldfusion, cpp, css, delphi, diff, erlang, groovy, java, javafx, javascript, perl, php, powershell, python, ruby, scala, sql, vb
- HTML/XML support with case-insensitive mapping
- Defaults to 'none' for unsupported languages
- Code blocks over 20 lines are automatically collapsed

#### Markup Conversion Rules
- Headers: `# Title` → `h1. Title`
- Bold: `**text**` → `*text*`
- Italic: `*text*` → `_text_`
- Code: `` `code` `` → `{{code}}`
- Links: `[text](url)` → `[text|url]`
- Images: `![alt](src)` → `!src!`
- Tables: Standard table syntax with `||` for headers, `|` for cells

### Browser Component
- Uses webpack for bundling
- jQuery-based UI with live conversion
- Loads demo.md as default content