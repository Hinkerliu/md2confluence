#!/bin/bash

# Markdown2Confluence 服务器部署脚本
# 用于在远程服务器 192.168.40.108:8092 上部署服务

set -e  # 遇到错误时退出

echo "🚀 开始部署 Markdown2Confluence 服务器..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
SERVER_IP="192.168.40.108"
SERVER_PORT="8092"
APP_DIR="/opt/markdown2confluence"
SERVICE_NAME="markdown2confluence"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Node.js环境
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_status "Node.js 版本: $NODE_VERSION"
}

# 检查npm环境
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装，请检查 Node.js 安装"
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_status "npm 版本: $NPM_VERSION"
}

# 创建应用目录
create_app_dir() {
    print_status "创建应用目录 $APP_DIR"
    
    if [[ $EUID -eq 0 ]]; then
        mkdir -p $APP_DIR
        cd $APP_DIR
    else
        print_warning "非root用户，使用当前目录"
        APP_DIR=$(pwd)
    fi
}

# 安装依赖
install_dependencies() {
    print_status "安装 Express 依赖..."
    npm install express
    
    if [ $? -eq 0 ]; then
        print_status "依赖安装成功"
    else
        print_error "依赖安装失败"
        exit 1
    fi
}

# 启动服务器
start_server() {
    print_status "启动 Markdown2Confluence 服务器..."
    print_status "服务器地址: http://$SERVER_IP:$SERVER_PORT"
    
    # 检查端口是否被占用
    if lsof -Pi :$SERVER_PORT -sTCP:LISTEN -t >/dev/null ; then
        print_warning "端口 $SERVER_PORT 已被占用，尝试停止现有进程..."
        pkill -f "node server.js" || true
        sleep 2
    fi
    
    # 启动服务器
    nohup node server.js > server.log 2>&1 &
    SERVER_PID=$!
    
    sleep 3
    
    # 检查服务器是否启动成功
    if ps -p $SERVER_PID > /dev/null; then
        print_status "服务器启动成功 (PID: $SERVER_PID)"
        print_status "日志文件: $APP_DIR/server.log"
        
        # 测试连接
        sleep 2
        if curl -s http://localhost:$SERVER_PORT/health > /dev/null; then
            print_status "服务器健康检查通过 ✅"
        else
            print_warning "服务器启动但健康检查失败"
        fi
    else
        print_error "服务器启动失败"
        exit 1
    fi
}

# 创建systemd服务（仅root用户）
create_systemd_service() {
    if [[ $EUID -ne 0 ]]; then
        print_warning "需要root权限创建systemd服务，跳过..."
        return
    fi
    
    print_status "创建systemd服务..."
    
    cat > /etc/systemd/system/${SERVICE_NAME}.service << EOF
[Unit]
Description=Markdown2Confluence Web Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=${SERVICE_NAME}
Environment=NODE_ENV=production
Environment=PORT=${SERVER_PORT}

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable ${SERVICE_NAME}
    
    print_status "systemd 服务创建完成"
}

# 显示访问信息
show_access_info() {
    print_status "🎉 部署完成！"
    echo ""
    echo "📍 访问地址:"
    echo "   本地访问: http://localhost:$SERVER_PORT"
    echo "   网络访问: http://$SERVER_IP:$SERVER_PORT"
    echo "   浏览器界面: http://$SERVER_IP:$SERVER_PORT/browser/"
    echo "   健康检查: http://$SERVER_IP:$SERVER_PORT/health"
    echo ""
    echo "📋 管理命令:"
    echo "   查看日志: tail -f server.log"
    echo "   停止服务: pkill -f 'node server.js'"
    echo "   重启服务: ./deploy.sh"
    
    if [[ $EUID -eq 0 ]]; then
        echo "   systemd管理: systemctl start/stop/restart $SERVICE_NAME"
    fi
    
    echo ""
    echo "🔍 测试服务:"
    echo "   curl http://$SERVER_IP:$SERVER_PORT/health"
    echo ""
}

# 主函数
main() {
    print_status "开始部署到 $SERVER_IP:$SERVER_PORT"
    
    check_node
    check_npm
    create_app_dir
    install_dependencies
    start_server
    create_systemd_service
    show_access_info
}

# 执行主函数
main "$@"