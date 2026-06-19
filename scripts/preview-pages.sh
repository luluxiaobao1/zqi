#!/bin/bash
# 本地模拟 GitHub Pages 部署环境进行验证（推送前必跑）
#
# GitHub Pages 站点根为 https://<user>.github.io/zhiqi/
# Next.js 配置 basePath:'/zhiqi'，out/ 内资源均引用 /zhiqi/...
# 本脚本把 out/ 映射到本地服务器的 /zhiqi/ 路径下，完整复现线上行为，
# 用于在推送 GitHub 之前确认页面可正常访问、无死循环。
#
# 用法:
#   bash ./scripts/preview-pages.sh         # 构建 + 启动预览
#   bash ./scripts/preview-pages.sh --no-build  # 跳过构建，复用已有 out/

set -Eeuo pipefail

WORKSPACE="${COZE_WORKSPACE_PATH:-$(pwd)}"
cd "${WORKSPACE}"

PORT=4321
PREVIEW_DIR=".pages-preview"

# 1. 构建静态产物
if [[ "${1:-}" != "--no-build" ]]; then
  echo "▶ 构建静态导出 (pnpm next build)..."
  rm -rf out .next
  pnpm next build
else
  echo "▶ 跳过构建，复用已有 out/"
fi

if [[ ! -f out/index.html ]]; then
  echo "✗ 未找到 out/index.html，构建可能失败" >&2
  exit 1
fi

# 2. 组装与 GitHub Pages 完全一致的目录结构: <root>/zhiqi/...
echo "▶ 组装 Pages 预览目录 (${PREVIEW_DIR}/zhiqi/)..."
rm -rf "${PREVIEW_DIR}"
mkdir -p "${PREVIEW_DIR}/zhiqi"
cp -r out/. "${PREVIEW_DIR}/zhiqi/"
touch "${PREVIEW_DIR}/zhiqi/.nojekyll"

# SPA fallback: 用首页 HTML 作为 404，由客户端路由接管深链接（不做自我跳转）
cp "${PREVIEW_DIR}/zhiqi/index.html" "${PREVIEW_DIR}/zhiqi/404.html"

# 3. 校验关键结构，提前拦截死循环类问题
echo "▶ 校验输出结构..."
test -f "${PREVIEW_DIR}/zhiqi/index.html" && echo "  ✓ /zhiqi/index.html 存在" || { echo "  ✗ 缺少 index.html"; exit 1; }
test -d "${PREVIEW_DIR}/zhiqi/login" && echo "  ✓ /zhiqi/login/ 目录存在（trailingSlash 生效）" || echo "  ⚠ 未发现 login 目录，请检查 next.config.ts 的 trailingSlash"
if grep -q "location.replace" "${PREVIEW_DIR}/zhiqi/index.html"; then
  echo "  ✗ index.html 含自我跳转脚本，线上会死循环！" >&2
  exit 1
else
  echo "  ✓ index.html 是真实应用首页（无自我跳转）"
fi

# 4. 清理可能占用的端口
if command -v lsof >/dev/null 2>&1; then
  EXIST_PID=$(lsof -ti tcp:${PORT} 2>/dev/null || true)
  if [[ -n "${EXIST_PID}" ]]; then
    echo "▶ 端口 ${PORT} 被占用 (PID ${EXIST_PID})，先清理..."
    echo "${EXIST_PID}" | xargs kill -9 2>/dev/null || true
    sleep 1
  fi
fi

# 5. 启动静态服务器
echo ""
echo "════════════════════════════════════════════════════════════"
echo "  本地预览已就绪，请在浏览器打开（模拟 GitHub Pages）："
echo "    首页:    http://localhost:${PORT}/zhiqi/"
echo "    登录页:  http://localhost:${PORT}/zhiqi/login/"
echo "  验证无误后再 git push。按 Ctrl+C 停止预览。"
echo "════════════════════════════════════════════════════════════"
echo ""

cd "${PREVIEW_DIR}"
python3 -m http.server "${PORT}"
