/**
 * 统一的导航工具：自动处理 basePath 与尾斜杠，彻底消除散落各处的 "/zhiqi" 硬编码。
 *
 * 背景：
 * - 项目部署在 GitHub Pages 子路径下（basePath，见 next.config.ts）。
 * - Next.js 的 <Link> / useRouter 会自动加 basePath，但原生的
 *   window.location.href / window.open 不会，必须手动补齐，否则会丢失前缀导致 404。
 * - trailingSlash:true 要求内部路由以 "/" 结尾，否则静态托管会 404。
 *
 * 用法：
 *   import { withBasePath, navigateTo, openInNewTab } from "@/lib/navigation";
 *   navigateTo("/login");                 // -> 跳转到 /zhiqi/login/
 *   openInNewTab("/admin", { tab: "members" }); // -> 新开 /zhiqi/admin/?tab=members
 *   <a href={withBasePath("/console/cost")}>  // -> /zhiqi/console/cost/
 */

// basePath 由 next.config.ts 注入，仓库改名时只需改配置那一处。
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '')

/** 判断是否为外部绝对地址（http/https/protocol-relative/mailto 等），这类不加 basePath。 */
function isExternal(path: string): boolean {
  return /^([a-z]+:)?\/\//i.test(path) || /^[a-z]+:/i.test(path)
}

/**
 * 给站内路径补上 basePath 与尾斜杠（保留 query / hash）。
 * 外部绝对地址原样返回。
 */
export function withBasePath(path: string): string {
  if (!path || isExternal(path)) return path

  // 拆出 query 与 hash，仅对 pathname 处理尾斜杠
  const hashIndex = path.indexOf('#')
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : ''
  const noHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path

  const queryIndex = noHash.indexOf('?')
  const query = queryIndex >= 0 ? noHash.slice(queryIndex) : ''
  let pathname = queryIndex >= 0 ? noHash.slice(0, queryIndex) : noHash

  // 确保以 "/" 开头
  if (!pathname.startsWith('/')) pathname = '/' + pathname

  // 避免重复添加 basePath
  if (BASE_PATH && !pathname.startsWith(BASE_PATH + '/') && pathname !== BASE_PATH) {
    pathname = BASE_PATH + pathname
  }

  // trailingSlash:true —— 目录型路径补尾斜杠（排除带扩展名的文件，如 .ico/.png）
  const lastSegment = pathname.split('/').pop() ?? ''
  const looksLikeFile = lastSegment.includes('.')
  if (!pathname.endsWith('/') && !looksLikeFile) {
    pathname = pathname + '/'
  }

  return pathname + query + hash
}

/** 当前页面整页跳转（带 basePath 与尾斜杠）。 */
export function navigateTo(path: string): void {
  if (typeof window === 'undefined') return
  window.location.href = withBasePath(path)
}

/** 新标签页打开（带 basePath 与尾斜杠）；可选附加 query 参数。 */
export function openInNewTab(
  path: string,
  query?: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined') return
  let target = withBasePath(path)
  if (query && Object.keys(query).length > 0) {
    const qs = new URLSearchParams(
      Object.entries(query).map(([k, v]) => [k, String(v)]),
    ).toString()
    target += (target.includes('?') ? '&' : '?') + qs
  }
  window.open(target, '_blank')
}
