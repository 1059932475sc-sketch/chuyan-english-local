#!/bin/zsh
cd -- "$(dirname -- "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo '请先安装 Node.js 22 或更新版本。'
  read '?按回车关闭。'
  exit 1
fi
if [ ! -d node_modules/kokoro-js ]; then
  echo '首次启动正在安装语音运行依赖，请保持联网。'
  npm ci --cache .cache/npm || exit 1
fi
echo '浏览器地址：http://localhost:4173'
node server.mjs
read '?按回车关闭。'
