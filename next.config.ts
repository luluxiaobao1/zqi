import type { NextConfig } from 'next'

// 唯一的 basePath 配置源（与 GitHub 仓库名一致，**无尾斜杠**）。
// 仓库改名时只需改这一处；客户端通过 NEXT_PUBLIC_BASE_PATH 读取，杜绝硬编码。
const BASE_PATH = '/zhiqi'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,     // 与 basePath 保持一致，**无尾斜杠**
  trailingSlash: true,        // 静态导出必须 true，保证每个路由生成目录下的 index.html
  images: {
    unoptimized: true,        // GitHub Pages 不能用图片优化
  },
  env: {
    // 注入到客户端，供 src/lib/navigation.ts 的 withBasePath 使用
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  // 不要配置任何 rewrites / redirects，避免在 / 与 /zhiqi/ 之间产生跳转循环
}

export default nextConfig
