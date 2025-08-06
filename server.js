#!/usr/bin/env node

const express = require('express');
const path = require('path');
const md2confluence = require('./index');

const app = express();
const PORT = 8092;

// 静态文件服务 - 但排除index.html，我们要用server.html
app.use(express.static(path.join(__dirname, 'browser'), {
    index: false  // 禁用自动提供index.html
}));
app.use(express.static(__dirname));

// 解析JSON和URL编码的请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API端点 - 转换markdown
app.post('/api/convert', (req, res) => {
    try {
        const { markdown } = req.body;
        if (!markdown) {
            return res.status(400).json({ error: 'Markdown content is required' });
        }
        
        const confluenceMarkup = md2confluence(markdown);
        res.json({ 
            success: true, 
            markup: confluenceMarkup,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Conversion failed' 
        });
    }
});

// 主页重定向到浏览器界面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'browser', 'server.html'));
});

app.get('/browser/', (req, res) => {
    res.sendFile(path.join(__dirname, 'browser', 'server.html'));
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'markdown2confluence',
        version: require('./package.json').version,
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Markdown2Confluence Server is running!`);
    console.log(`📍 Local:    http://localhost:${PORT}`);
    console.log(`📍 Network:  http://192.168.40.108:${PORT}`);
    console.log(`🌐 Browser:  http://192.168.40.108:${PORT}/browser/`);
    console.log(`🔍 Health:   http://192.168.40.108:${PORT}/health`);
    console.log('');
    console.log('Press Ctrl+C to stop the server');
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});