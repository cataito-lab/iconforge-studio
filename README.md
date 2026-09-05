# Cataito Tools（tools.cataito.com）

纯前端、零依赖、完全本地运行的在线工具站。已上线四大工具 + 中英双语 SEO 指南，全部图像处理在浏览器本地完成，**文件不会上传到任何服务器**。

- 线上地址：<https://tools.cataito.com>
- 仓库：<https://github.com/cataito-lab/iconforge-studio>（Cloudflare Pages 连接此仓库自动部署）

## 已上线工具

| 工具 | 路径 | 说明 |
| --- | --- | --- |
| IconForge 图标工坊 | `/icon-forge/` | Logo → ICO / 多尺寸 PNG，Light/Dark 双变体，ZIP 打包（自实现 ZIP：查表法 CRC32 + UTF-8 文件名 + 固定时间戳；文件名净化防路径穿越） |
| Favicon 生成器 | `/favicon/` | 一键生成全平台 favicon 套件 |
| 图片压缩 | `/compress/` | 批量压缩 JPG/PNG/WebP（上限 20 张），智能格式选择（auto：透明走 WebP/PNG、不透明比 JPEG vs WebP 择小）、质量滑块 30–95、最长边限制、ZIP 批量下载；压缩结果反而更大时诚实保留原图 |
| 配色 / 调色板 | `/palette/` | 上传图片用中位切分法提取主色，生成互补/类似/三角/单色方案，支持复制全部 HEX、导出 CSS 变量、下载 PNG 色卡；所有计算在浏览器本地完成 |

另有四篇 SEO 内容支柱：`/guides/`（ICO 完全指南、Favicon 完全指南、暗色图标设计指南、图片压缩指南，中英双语）。

## 站点结构
`dist/` 既是部署产物，也是站点源码（纯静态、零构建、零依赖）：
```
dist/
  index.html              # 首页 / 工具 hub（JSON-LD 结构化数据）
  icon-forge/index.html   # 工具一：图标工坊
  favicon/index.html      # 工具二：Favicon 生成器
  compress/index.html     # 工具三：图片压缩
  palette/index.html      # 工具四：配色 / 调色板
  guides/                 # SEO 指南（含中英 hreflang）
  assets/css/site.css     # 共享外壳样式 + 全站设计令牌（:root / html.dark）
  assets/js/site.js       # 共享外壳逻辑（导航注入 / 中英双语 / 页脚 / 主题按钮）
  assets/js/theme-init.js # 全站主题系统（见下）
  assets/img/icon.svg     # 站点图标
  sitemap.xml             # 站点地图（含中英 hreflang 备用链接）
  robots.txt
```
根目录 `IconForge-Studio-v1.1-fixed.html` 为 IconForge 的单体历史源文件（逻辑已并入 `dist/icon-forge/`），新功能请在 `dist/` 内维护。

> 注意：`2026-08-20-5d539ce0/`（约 3.28GB 旧构建快照）已被 `.gitignore` 排除，请勿入库。

## 全站约定（新增页面必须遵守）

### 主题（亮/暗）
- 每页 `<head>` 同步引入 `theme-init.js`（防首屏闪烁），**禁止**写死 `class="dark"`
- 存储：`localStorage.cataito-theme`（旧键 `iconforge-theme` 自动迁移）；无显式选择时跟随系统 `prefers-color-scheme`
- API：`window.CATAITO_THEME.{get,set,toggle}`；变更派发 `cataito-theme-change` 事件
- 颜色令牌统一在 `site.css` 的 `:root` / `html.dark` 定义（含 `color-scheme` 声明），**工具页不得内嵌自定义颜色令牌**（IconForge 曾因此导致 favicon 页引用未定义变量的 bug）

### 设计令牌（`site.css` `:root` / `html.dark`）

设计语言为**「印刷工具目录」**（2026-09-04 UI 重构定稿）：米纸底 + 墨色文字 + 朱砂印章式点缀，结构靠规则线（1px 发丝线 / 2px 粗规则线）而非投影卡片，左对齐版式，编号索引行替代卡片网格，等宽字体用于序号/标签/页脚。令牌层从纯色彩扩展为完整的设计体系（色彩 + 间距 + 字号 + 字体 + 行高 + 圆角 + 阴影）：

**色彩令牌**

| 令牌 | 亮色 | 暗色 | 用途 |
| --- | --- | --- | --- |
| `--bg` | `#f6f3ec` | `#15130f` | 页面底色（米纸 / 暖黑） |
| `--bg-canvas` | `#eeeae0` | `#100e0b` | Canvas 工作区底色 |
| `--card` / `--card-2` | `#faf8f2` / `#efebe1` | `#1c1915` / `#241f19` | 卡片 / 次级卡片底色 |
| `--border` | `#d9d2c3` | `#37312a` | 发丝线边框 |
| `--text` / `--text-2` / `--text-3` | `#211e19` / `#5c564a` / `#97907f` | `#ece5d6` / `#b0a897` / `#7d7666` | 墨色主/次/弱文字 |
| `--accent` / `--accent-hover` | `#bf4324` / `#a53718` | `#e06842` / `#ec7c58` | 朱砂主色（印章式点缀，不滥用） |
| `--accent-soft` / `--accent-soft-2` | `rgba(191,67,36,.08)` / `.04` | `rgba(224,104,66,.14)` / `.07` | 主色透明底（hover/soft bg） |
| `--accent-glow` | `rgba(191,67,36,.16)` | `rgba(224,104,66,.18)` | CTA 光晕（指南页 .cta-btn 用） |
| `--danger` / `--success` / `--warning` | `#b3362a` / `#3d7a50` / `#a8681c` | `#e2695c` / `#6fae83` / `#d19a5b` | 语义色 |
| `--checker` | `#e3ddd0` | `rgba(255,255,255,.06)` | 透明棋盘格底色 |

**体系令牌**

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--radius` / `--radius-sm` | `3px` / `2px` | 印刷风锐利圆角 |
| `--sp-1` ~ `--sp-8` | `4/8/12/16/20/24/32/48px` | 间距刻度（替代散落的硬编码 px） |
| `--fs-xs` ~ `--fs-xl` | `12/13.5/15/17/22px` | 字号刻度 |
| `--lh-body` | `1.7` | 正文行高 |
| `--font-mono` | `ui-monospace, SFMono-Regular, Menlo, Consolas, ...` | 等宽字体栈（序号/标签/徽标/页脚） |
| `--shadow-sm` / `--shadow-md` | 极轻 / 中等 | 仅 Toast/弹窗用投影；卡片靠边框 |

> **设计语言约定**：① 主按钮 = 墨色实心（`var(--text)` 底），悬停转朱砂；次按钮 = 描边。② 朱砂只用于印章式点缀（序号、Q. 前缀、徽标描边、hover 指示），不大面积铺。③ 结构靠规则线：hero 与工具列表顶部 2px 粗线、区块间发丝线。④ 首页工具区是**编号目录行**（`.tool-card` CSS counter 自动编号 01/02/…），不是卡片网格。⑤ body::before 有极低透明度 SVG 噪点层模拟纸张颗粒（pointer-events: none）。⑥ 新页面/新组件一律用令牌，**严禁硬编码色值/字体栈**。

### 国际化（中/英）
- 词条放 `site.js` 的 `t()` 词典；HTML 用 `data-i18n` 属性标记
- 动态文本监听 `cataito-lang-change` 事件刷新；URL 支持 `?lang=en`

### 共享组件层（`.t-*`，三个工具页统一使用）
`site.css` 里定义了一套工具页通用组件，**新增工具必须直接复用，不要在各页内联复制样式**：

| 类 | 用途 | 类 | 用途 |
| --- | --- | --- | --- |
| `.t-head` | 页头容器（面包屑+h1+sub） | `.t-card` | 卡片容器 |
| `.t-flow` | 单列内容流（收窄 760px） | `.t-block` | 卡片内分区（带分隔线） |
| `.t-split` | 双列布局（工作区+侧栏） | `.t-side` | 侧栏（桌面 sticky 吸附） |
| `.t-drop` | 上传区（`.compact` 横向变体） | `.t-field` / `.t-label` / `.t-hint` | 字段与说明 |
| `.t-input` / `.t-select` / `.t-range` | 表单控件 | `.t-seg` / `.t-seg-item` | 分段单选控件 |
| `.t-chips` / `.t-chip`（`.box`） | 多选芯片 | `.t-switch-row` / `.t-switch` | 开关 |
| `.t-btn`（`.primary` `.block`） | 按钮 | `.t-icon-btn`（`.danger`） | 方形图标按钮 |
| `.t-list` / `.t-row` / `.t-thumb` / `.t-badge` | 结果行列表 | `.t-bar` / `.t-bar-stats` | 汇总操作条 |
| `.t-toast` | 消息提示（`.warn` `.error`） | `.t-modal` / `.t-progress` | 进度弹窗 |
| `.t-empty` / `.t-note` / `.t-callout` | 空状态 / 备注 / 提示条 | `.t-checker` | 透明棋盘格背景工具类 |
| `.t-prose` | 底部内容板块容器 | `.t-steps` | 编号步骤列表 |
| `.t-faq` / `.t-faq-item` / `.t-faq-q` / `.t-faq-a` | 常见问题 | `.t-guide-links` / `.t-guide-link` | 相关指南链接卡 |

页面内只允许写**本工具专属**的样式（如 IconForge 的预览舞台、Favicon 的预览缩略图）。

> **布局铁律**：按钮 / 字段 / 操作栏等交互块必须写在 `.t-card` **内部**。一旦因布局需要把它们放在 `.t-card` 之外（如 IconForge 的「一键生成」按钮块是 `.t-side` 的兄弟），针对 `.t-card` 子元素的间距规则会整体失效、块紧贴上方卡片。此时必须补一条兄弟级规则（如 `.t-card + .t-block { margin-top: 20px }`）。详见 HANDOVER.md 铁律 9。

> **每个工具页底部都应带 `.t-prose` 内容板块**（如何使用 + 常见问题 + 相关指南）。原因：纯交互页面可索引正文太少会被判为 thin content，且工具页 → 指南页的反向内链是站内权重回流的关键路径。

### 新增工具六步
1. 新建 `dist/<tool>/index.html`，挂 `theme-init.js`（`<head>` 同步 + `site.js` 标 `defer`）
   - ⚠️ `site.js` 后的内联页面脚本若顶层用到 `t()` / `window.CATAITO_I18N`（如 `render()`、`updateXxx()`），必须整体包进 `document.addEventListener('DOMContentLoaded', …)`，否则 `defer` 后内联脚本先于 `site.js` 执行、翻译会渲染成原始 i18n key。详见 HANDOVER.md 铁律 10。
2. 页面骨架：`<div id="site-header">` → `<main class="site-main">`（含 `.t-head`）→ 内容区（`.t-flow` 单列或 `.t-split` 双列）→ `<div id="site-footer">`
3. 底部加 `.t-prose` 内容板块（如何使用 / 常见问题 / 相关指南），词条进 `site.js` 词典；**含内嵌标签的文案必须用 `data-i18n-html`**
4. `site.js` 词典加 `home_tool_<name>` 等词条，导航注入处加入口
5. 首页卡片转正（去 `is-soon`）+ JSON-LD 加 SoftwareApplication 条目 + `sitemap.xml` 加 URL（priority ~0.9 + hreflang 三连）
6. 测试（方法见 HANDOVER.md）→ commit → push

## 本地预览
直接用浏览器打开 `dist/index.html` 即可。如需本地服务器：
```bash
python -m http.server 8080 --directory dist
# 浏览器访问 http://localhost:8080
```

## 部署（Cloudflare Pages）
仓库已连接自动部署：push 到 `master` 即上线（无需手动操作）。
- **Build command**：留空（纯静态，`dist/` 已是完整可部署目录；**切勿**设置旧命令 `cp IconForge-Studio-v1.1-fixed.html dist/index.html`，会覆盖首页 hub）
- **Output directory**：`dist`
- 自定义域名 `tools.cataito.com`：CNAME → `<项目名>.pages.dev`，已代理（橙色云朵），SSL 自动签发

push 后若线上未更新，到 Cloudflare Dashboard → 该域名 → **缓存（Caching）→ 配置 → 清除缓存（Purge Everything）**——自定义域名有边缘缓存。
