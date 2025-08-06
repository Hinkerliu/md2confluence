# 服务器部署指南

本指南将帮助您在远程服务器（192.168.40.108:8092）上部署 Markdown2Confluence 在线转换服务。

## 🎯 部署目标

- **服务器地址**: `192.168.40.108:8092`
- **访问方式**: 浏览器访问 `http://192.168.40.108:8092`
- **功能**: 在线 Markdown 到 Confluence 标记语言转换

## 📋 环境要求

### 基础环境
- **操作系统**: Linux (Ubuntu/CentOS/RHEL)
- **Node.js**: v14.0+ 
- **npm**: 6.0+
- **内存**: 最低 512MB
- **磁盘**: 最低 100MB

### 网络要求
- 端口 8092 可用
- 允许外部访问（防火墙配置）

## 🚀 快速部署

### 方法一：自动部署脚本

1. **上传文件到服务器**
   ```bash
   # 将整个项目文件夹上传到服务器
   scp -r markdown2confluence user@192.168.40.108:/opt/
   ```

2. **执行部署脚本**
   ```bash
   ssh user@192.168.40.108
   cd /opt/markdown2confluence
   ./deploy.sh
   ```

3. **验证部署**
   ```bash
   curl http://192.168.40.108:8092/health
   ```

### 方法二：手动部署

1. **连接服务器**
   ```bash
   ssh user@192.168.40.108
   ```

2. **创建项目目录**
   ```bash
   mkdir -p /opt/markdown2confluence
   cd /opt/markdown2confluence
   ```

3. **上传项目文件**
   ```bash
   # 上传所有项目文件到当前目录
   ```

4. **安装依赖**
   ```bash
   npm install
   ```

5. **启动服务器**
   ```bash
   npm start
   ```

## 🔧 配置说明

### 服务器配置

主要配置文件：
- `server.js` - Express 服务器主文件
- `.env` - 环境变量配置
- `package.json` - 项目依赖配置

### 端口配置

默认端口：`8092`

如需修改端口，编辑 `server.js`:
```javascript
const PORT = process.env.PORT || 8092;
```

### 防火墙配置

确保端口 8092 对外开放：

**Ubuntu/Debian:**
```bash
sudo ufw allow 8092
sudo ufw reload
```

**CentOS/RHEL:**
```bash
sudo firewall-cmd --permanent --add-port=8092/tcp
sudo firewall-cmd --reload
```

## 📁 文件结构

```
markdown2confluence/
├── server.js              # Express 服务器
├── index.js              # 转换核心逻辑
├── package.json          # 项目配置
├── deploy.sh            # 部署脚本
├── .env                 # 环境配置
├── browser/
│   ├── server.html      # 现代化web界面
│   ├── app-server.js    # 客户端JavaScript
│   ├── index.html       # 原版界面（备用）
│   └── app.js          # 原版客户端脚本
├── bin/
│   └── markdown2confluence.js  # CLI工具
└── README.md           # 项目文档
```

## 🌐 访问方式

部署成功后，可通过以下方式访问：

### Web 界面
- **主界面**: http://192.168.40.108:8092
- **浏览器转换**: http://192.168.40.108:8092/browser/

### API 接口
- **转换API**: `POST http://192.168.40.108:8092/api/convert`
  ```bash
  curl -X POST http://192.168.40.108:8092/api/convert \
    -H "Content-Type: application/json" \
    -d '{"markdown": "# Hello World"}'
  ```

- **健康检查**: `GET http://192.168.40.108:8092/health`

### CLI 工具
如果全局安装：
```bash
npm install -g markdown2confluence
markdown2confluence input.md
```

## 🛠️ 服务管理

### 启动服务
```bash
# 开发模式
npm start

# 后台运行
nohup npm start > server.log 2>&1 &

# 使用 PM2
pm2 start server.js --name markdown2confluence
```

### 停止服务
```bash
# 查找进程
ps aux | grep node

# 停止进程
pkill -f "node server.js"

# 使用 PM2
pm2 stop markdown2confluence
```

### 查看日志
```bash
# 直接查看
tail -f server.log

# 使用 PM2
pm2 logs markdown2confluence
```

## 🔍 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查看端口占用
   lsof -i :8092
   
   # 停止占用进程
   kill -9 <PID>
   ```

2. **npm 依赖问题**
   ```bash
   # 清除缓存
   npm cache clean --force
   
   # 重新安装
   rm -rf node_modules
   npm install
   ```

3. **权限问题**
   ```bash
   # 更改文件权限
   chmod +x deploy.sh
   chmod +x server.js
   ```

4. **防火墙阻止访问**
   ```bash
   # 检查防火墙状态
   sudo ufw status
   
   # 开放端口
   sudo ufw allow 8092
   ```

### 服务状态检查

```bash
# 检查服务是否运行
curl http://localhost:8092/health

# 检查端口监听
netstat -tlnp | grep 8092

# 检查进程
ps aux | grep "node server.js"
```

## 📈 性能优化

### 生产环境建议

1. **使用 PM2 进行进程管理**
   ```bash
   npm install -g pm2
   pm2 start server.js --name markdown2confluence -i max
   ```

2. **配置反向代理（Nginx）**
   ```nginx
   server {
       listen 80;
       server_name 192.168.40.108;
       
       location / {
           proxy_pass http://localhost:8092;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **启用 HTTPS（可选）**
   配置 SSL 证书和 HTTPS 重定向

## 🔒 安全建议

1. **限制访问来源**
   - 配置防火墙规则
   - 使用反向代理进行访问控制

2. **定期更新依赖**
   ```bash
   npm audit
   npm update
   ```

3. **监控日志**
   - 定期检查访问日志
   - 监控异常请求

## 📞 技术支持

如遇到问题：

1. 检查 [故障排除](#故障排除) 部分
2. 查看服务器日志 `server.log`
3. 访问健康检查接口确认服务状态
4. 查阅项目 README.md 和 readme-cn.md

---

**部署完成后，您就可以在浏览器中访问 `http://192.168.40.108:8092` 使用 Markdown 到 Confluence 的转换服务了！** 🎉