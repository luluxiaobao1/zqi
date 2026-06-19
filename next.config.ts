import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/zhiqi',         // 必须和仓库名完全一致，**无尾斜杠**
  assetPrefix: '/zhiqi',      // 与 basePath 保持一致，**无尾斜杠**
  trailingSlash: true,        // 静态导出必须 true，保证每个路由生成目录下的 index.html
  images: {
    unoptimized: true,        // GitHub Pages 不能用图片优化
  },
  // 不要配置任何 rewrites / redirects，避免在 / 与 /zhiqi/ 之间产生跳转循环
}

export default nextConfig
