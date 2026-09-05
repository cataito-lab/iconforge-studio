# OPERATIONS — iconforge-studio（tools.cataito.com）

> 技术架构与运维约定（multi-agent-handoff 协议三必需文件之一，**本文件入库**）。
> 交接状态看 `HANDOFF.md`，历史决策看 `DECISIONS.md`，深度细节与逐日日志看 `HANDOVER.md`。
> 改动代码后必须同步更新本文件（Aaron 文档铁律 2026-09-02）。

## 一、项目定位

- **tools.cataito.com** — CATAITO 旗下纯前端免费工具站（变现试验田）
- 商业模式：Google SEO 自然流量 → CF Web Analytics 度量 → AdSense（等收录信号）
- 母站 `cataito.com`；⚠️ `catai.cc.cd` 是另一个项目 CATAI（无 O），不是母站
- 站名展示一律大写 **CATAITO**（域名/邮箱/存储键除外）

## 二、架构（零构建零依赖，硬约束）

- 纯静态 HTML/CSS/JS；**`dist/` = 源码 = 部署产物**；无 package.json、无构建、无 CI
- 部署：Cloudflare Pages 连 GitHub 仓库，**push `master` 自动上线**（build command 留空，output = `dist`）
- 域名：`tools.cataito.com` CNAME → `<项目>.pages.dev`，橙色云朵代理 → **有边缘缓存，大改后必须 Purge Everything**
- 所有图像处理在浏览器本地 Canvas 完成；ZIP 打包自研（CRC32 查表 + UTF-8 文件名 flag bit 11 + 固定时间戳 1980-01-01），**新工具直接复制 compress 里的实现，不引外部库**

## 三、共享代码职责

| 文件 | 职责 |
| --- | --- |
| `assets/css/site.css` | 设计令牌**唯一源**（`:root` 亮 / `html.dark` 暗）+ `.t-*` 工具页组件层 + 全站外壳样式 |
| `assets/js/site.js` | 外壳：注入 `#site-header` / `#site-footer`、i18n 词典 `t()`、`?lang=en`、favicon 跟随主题、og:image 兜底、**CF Analytics beacon（bindAnalytics）** |
| `assets/js/theme-init.js` | `<head>` 同步引入防闪（禁 defer）；`localStorage.cataito-theme`，跟随系统 |
| 各页 `index.html` | 工具专属逻辑与样式；通用组件一律复用 `.t-*`，页面内只写专属样式 |

⚠️ **注入容器无类名**：`renderHeader/renderFooter` 只输出 `#site-header` / `#site-footer` 容器（内部是 `.site-header__inner` / `.site-footer__inner`），**顶栏/页脚样式必须写在 ID 上**——历史上写在 `.site-header` / `.site-footer` 类上导致吸顶和页脚样式从未生效（2026-09-05 修复）。

## 四、设计语言速览

**「印刷工具目录」**：米纸 `#f6f3ec` / 墨色 `#211e19` / 朱砂 `#bf4324`（印章式点缀）；左对齐版式、编号目录行、规则线结构、等宽字体做序号/标签/页脚。完整令牌表（色彩/间距/字号/字体）与铁律见 `README.md` §设计令牌。**全站严禁硬编码色值/字体栈，一律用令牌。**

## 五、内容清单与新增 checklist

- 工具 5：`/icon-forge/`（ICO/PNG 图标）、`/favicon/`、`/compress/`（≤20 张批量）、`/palette/`、`/convert/`（PNG/JPEG/WebP 互转，转 JPEG 铺白底、WebP/PNG 保透明）
- 指南 10：ico-file-guide、favicon-guide、dark-mode-icons、image-compression-guide、webp-guide、color-guide、app-icon-sizes、png-to-ico-guide、favicon-not-showing-guide、transparent-icon-guide（均中英双语 `.lb-zh`/`.lb-en` 双块）
- 信任页：about / privacy / contact + 404（noindex）

**新增页面 checklist**：`sitemap.xml`（hreflang 三连 zh-CN/en/x-default + priority）→ `llms.txt` → guides 索引卡（如指南）→ `site.js` 词典（`gd_*` 键）→ 相关工具页反向内链 → `<title>` 双语 meta + JSON-LD。⚠️ 每新增一篇指南，首页「实用指南」区块（4 篇轮换 + 全部入口）与指南间互链网络也要同步评估（2026-09-05 B3 内链加固后建立的网络基线见 HANDOFF）。
- sitemap 现共 20 URL（首页 + 5 工具 + about/privacy/contact + /guides/ + 10 指南）；首页有「实用指南」编号目录区块（4 篇支柱 + 全部入口）；guides 索引页收齐 10 卡。

## 六、数据与统计

- **CF Web Analytics**：beacon 由 `site.js` 的 `bindAnalytics()` 统一注入（token 明文出现在源码是 CF 设计，非密钥）；无 cookie，隐私政策已声明
- **GSC**：`sitemap.xml` 18 URL，全带 hreflang 三连（zh-CN / en `?lang=en` / x-default）

## 七、本地开发与测试

- 预览：`python -m http.server 8080 --directory dist` → http://localhost:8080
- 静态验证：headless Chrome `--dump-dom` / 截图；功能验证（涉及 `canvas.toBlob`）：**必须 CDP 真实时间**
- **五大已知陷阱**（细节见 HANDOVER §六）：
  1. `--virtual-time-budget` 不等待大画布 WebP 编码线程（假 0 字节）
  2. CDP/DevTools 一律用 `localhost`，不用 `127.0.0.1`（IPv6 回环绑定问题）
  3. CDP 每次必须全新 `--user-data-dir`（旧 profile 缓存 → 假阴性）
  4. 注入 localStorage 前必须先 navigate 到同源页面
  5. 测完 `taskkill /F /IM chrome.exe` 清残留；诊断临时文件用完即删

## 八、Git 与发布流程

- commit 一律**精确文件列表**，禁用 `git add -A`
- **push 严格模式**：任何 push 前必须 Aaron 明确回复「推」才执行
- 隐私钩子 `.git/hooks/pre-push` 已安装：拦 HANDOFF/DECISIONS/HANDOVER/AGENTS/CLAUDE/.env/密钥等（hook 不进版本库，**新 clone 需重装**，模板在本 hermes skill `scripts/privacy-pre-push.sh`）
- 交接文档（HANDOFF/DECISIONS/HANDOVER）**不入库**——本仓库隐私红线优先于 skill 的 handoff-commit 步骤
- push 后大改 → Cloudflare Dashboard → 缓存 → **Purge Everything**

## 九、铁律索引

12 条铁律全文见 `HANDOVER.md` §三，决策化版本见 `DECISIONS.md`。硬约束速记：

纯前端零依赖 ｜ 令牌唯一源（site.css）｜ `.t-*` 组件复用 ｜ 禁写死 `class="dark"` ｜ `defer` + 内联脚本包 `DOMContentLoaded` ｜ `data-i18n` 不挂"前缀+动态内容"容器 ｜ `.article a` 特异度会压过单类按钮 ｜ 交互块置于 `.t-card` 内（或补兄弟级 margin 规则）｜ 事件绑定走 `bindXxx()` + `dataset.bound` 幂等 ｜ 首页保有静态正文 + llms.txt + 完整 JSON-LD
