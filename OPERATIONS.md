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
| `assets/js/site.js` | 外壳：注入 `#site-header` / `#site-footer`、i18n 词典 `t()`、`?lang=en`、**全站 favicon 统一切换 `/assets/img/cataito-logo.png`**、og:image 兜底、**CF Analytics beacon（bindAnalytics）** |
| `assets/js/theme-init.js` | `<head>` 同步引入防闪（禁 defer）；`localStorage.cataito-theme`，跟随系统 |
| 各页 `index.html` | 工具专属逻辑与样式；通用组件一律复用 `.t-*`，页面内只写专属样式；**每页 `<head>` 静态声明 `<link rel="icon" type="image/png" href="/assets/img/cataito-logo.png">`**（防首屏闪烁，不依赖 JS） |

### 三·五、并入独立单文件工具的规范（2026-10-14 建立，`/wechat-format/` 首例）

把外部做好的单文件工具（自带 `:root` 令牌 + 自带主题切换）并进本站时，必须做四件事，否则会污染全站或触发铁律 1：

1. **令牌收窄到容器**：把工具的 `:root{...}` 改成 `.wx-scope{...}`、`[data-theme="dark"]{...}` 改成 `html.dark .wx-scope{...}`，并把工具的全部 DOM 包在 `<div class="wx-scope">` 里。CSS 自定义属性沿祖先继承，工具内部读到的仍是它自己的值，站点读到的是 `site.css` 的值——**不改任何视觉数值就能消除撞名**（该工具与站点撞了 9 个令牌：`--bg --text --text-2 --text-3 --accent --accent-soft --border --radius-sm --shadow-sm`）。
2. **主题交还 theme-init**：删掉工具自带的 `<head>` 预应用脚本与 `data-theme` 写法，明暗一律由 `html.dark` 决定。工具原有的「外观三态」按钮保留功能，但改为驱动 `CATAITO_THEME.set('auto'|'light'|'dark')` 并监听 `cataito-theme-change` 同步图标——`theme-init.js` 已为此新增 `pref()` 与 `set('auto')`（auto = 删除存储键、跟随系统）。旧存储键在首次加载时一次性迁移。
3. **取消文档级高度锁**：工具若用 `html,body{height:100%}` + `body{overflow:hidden}`（铁律 5 禁止），改成 `.wx-scope{height:calc(100vh - 64px);display:flex;flex-direction:column}` + `.workspace{flex:1;min-height:0}`，并在 ≤1080px 断点里把 `.wx-scope` 恢复成 `height:auto` 让页面自然流式。
4. **不包 `DOMContentLoaded` 的例外**：若工具脚本里有被 HTML 内联 `on*` 属性引用的顶层函数（铁律 13），整体包进闭包会直接打断功能。此时**保持脚本原样不包**（`/wechat-format/` 就是这样：1900 行脚本裸放在 `</body>` 前）。不包闭包的代价是脚本内 JS 拼接的文案拿不到词典，用 §五·五 第 4 条的 `tx()` 现取现翻译解决——`site.js` 是 `defer`，内联脚本执行时词典还没就位，所以 `tx()` 必须带中文兜底实参，缺失时退回中文而不是退回空串。

⚠️ **注入容器无类名**：`renderHeader/renderFooter` 只输出 `#site-header` / `#site-footer` 容器（内部是 `.site-header__inner` / `.site-footer__inner`），**顶栏/页脚样式必须写在 ID 上**——历史上写在 `.site-header` / `.site-footer` 类上导致吸顶和页脚样式从未生效（2026-09-05 修复）。

## 四、设计语言速览

**「中性极简」**（2026-09-27 改版定稿，supersedes 印刷工具目录风）：白底 `#ffffff` / 近黑 `#171717` / 灰边框 `#e5e5e5`，点缀蓝 `#2563eb`（亮）/ `#3b82f6`（暗）只用于链接/主按钮/选中态；卡片 = 1px 边框 + 8px 圆角，hover 仅边框加深；无噪点/印章/编号/位移动画。导航为三类别下拉（图片与设计 / 文本与开发者 / PDF，`site.js` 的 `NAV_CATS`，新增工具只改数据）；`/image-tools/`、`/text/`、`/pdf/` 三个分类 hub 页。完整令牌表见 `README.md` §设计令牌。**全站严禁硬编码色值/字体栈，一律用令牌。**

## 五、内容清单与新增 checklist

- 工具 22：`/icon-forge/`（ICO/PNG 图标）、`/favicon/`、`/compress/`（≤20 张批量）、`/palette/`、`/convert/`（PNG/JPEG/WebP 互转，转 JPEG 铺白底、WebP/PNG 保透明）、`/resize/`（居中裁切 1:1/4:3/16:9/9:16 + 最长边缩放，默认保持原格式）、`/contrast/`（WCAG 对比度检查 + 自动调整）、`/qrcode/`（自研 QR 编码器，字节模式 v1-40，矩阵级验证）、`/barcode/`（Code128/EAN-13/UPC-A/EAN-8）、`/watermark/`、`/gradient/`、`/password/`、`/meta-tags/`、`/text/json/`（JSON 格式化/校验/压缩）、`/text/char-count/`（字数统计 + 阅读时长）、`/text/uuid/`（v4/v1/v5 UUID）、`/pdf/image-to-pdf/`（图片转 PDF，自研零依赖 PDF 写入器：JPEG DCTDecode 直嵌 + xref 表，适配图片/A4/Letter + 方向/边距/质量，透明铺白底）、`/text/diff/`（LCS 行级对比，三色高亮 + 行号 + 统计）、`/text/checksum/`（SHA-256/384/512/1，Web Crypto，期望值一键比对）、`/text/base64/`（Base64/URL 双向编解码，UTF-8 安全）、`/text/timestamp/`（当前时间戳实时 + 秒/毫秒与日期双向互转）、`/wechat-format/`（公众号排版：Markdown 编辑 + 20 套主题 + 样式内联压平，复制到公众号不跑版；由独立单文件工具并入，见 §三·五）
- 指南 26：ico-file-guide、favicon-guide、dark-mode-icons、image-compression-guide、webp-guide、color-guide、app-icon-sizes、png-to-ico-guide、favicon-not-showing-guide、transparent-icon-guide、accessibility-contrast-guide、qr-not-scanning-guide、barcode-guide、watermark-guide、gradient-guide、password-guide、meta-tags-guide、json-guide、word-count-guide、uuid-guide、jpg-to-pdf-guide、text-diff-guide、checksum-guide、base64-guide、timestamp-guide、wechat-format-guide（均中英双语 `.lb-zh`/`.lb-en` 双块）
- 信任页：about / privacy / contact + 404（noindex）

**新增页面 checklist**：`sitemap.xml`（hreflang 三连 zh-CN/en/x-default + priority，⚠️ **URL 结尾只能一个斜杠**——`/wechat-format//` 这种双斜杠与页面 canonical 不一致，会削弱规范信号）→ `llms.txt` → guides 索引卡（如指南）→ `site.js` 词典（`gd_*` 键，**先 grep 键名确认不重复**）→ 相关工具页反向内链 → `<title>` 双语 meta + JSON-LD → **`<head>` 内 AdSense 验证脚本**（历史上 `/barcode/` 与新指南页都漏过这一项）→ **`og:image` 四行静态块**（`og:image` + `og:image:width` + `og:image:height` + `twitter:image`；⚠️ 现仍缺 49 页，见下条待办——`site.js` 的 `bindOgImage()` 是运行时注入，社交与 AI 抓取器不执行 JS）。⚠️ 每新增一篇指南，首页「实用指南」区块（4 篇轮换 + 全部入口）与指南间互链网络也要同步评估（2026-09-05 B3 内链加固后建立的网络基线见 HANDOFF）。
- sitemap 现共 **56 URL**（首页 + 22 工具 + `/image-tools/` `/text/` `/pdf/` 三个分类页 + about/privacy/contact + /guides/ + 26 指南）；首页工具区按「图片与设计 / 文本与开发者 / PDF 文档」三类别分组（分类页入口在区标题右侧）；guides 索引页收齐 26 卡。导航为短标签（`nav_*` 词典键），完整名称在页面 h1 与首页卡。

## 五·五、i18n 词典治理（2026-10-13 建立）

`site.js` 的 `I18N` 是全站唯一词典（当前 **1242 键**，中英各一值）。四条硬规则：

1. **一个键只能定义一次**——JS 对象字面量后写覆盖先写，历史上 15 处重复键把正确英文盖成中文，导致 54/55 页英文模式漏翻。新增词条前先 grep 键名。
2. **`t()` 对缺失键返回空串**（不是返回键名）——所以「漏定义」表现为**内容凭空消失**（空白标签、空白 toast），而不是裸 key。只 grep 裸 key 的旧测法查不出这类 bug。
3. **只认四个属性**：`data-i18n` / `-html` / `-placeholder` / `-title`。`data-i18n-label` 一类的自造属性不会被处理（`<option>` 要翻译就直接用 `data-i18n`，改的是 textContent）。
4. **JS 拼出来的文案走 `tx(key, 中文兜底, vars)`**——工具页内联脚本里自建的字符串（弹出菜单、toast、草稿卡片、外观提示）拿不到 `data-i18n`，一律包 `tx()`：`function tx(k,zh,vars){ const v=window.CATAITO_I18N&&CATAITO_I18N.t(k,vars); if(v) return v; /* 否则把 ${var} 填进中文兜底 */ }`。词典缺失时退中文、不退空串，所以加词条失败也不会白屏。占位符语法 `${name}` 与 `t(key, vars)` 一致。

**验收口径**：英文模式下 `document.body.innerText` 不应出现 CJK——`html.lang-en .lb-zh{display:none}`，所以 innerText 天然排除中文正文块，残留即真漏翻（例外：语言切换按钮本身显示「中」，以及讲解中文概念的指南正文）。⚠️ **innerText 看不见隐藏层**：`display:none` 的模态框、`position:fixed` 未弹出的面板、瞬时 toast 全部不参与 innerText——`/wechat-format/` 首版就是这么漏掉整个帮助弹层和 14 个工具栏 tooltip。验收必须**真点开每一层**再读文本（`_cfp/wx_en_probe.js`：逐个点 `[data-tool]`、给 `.modal-mask` 加 `.show`、触发 toast，中英各跑一遍）。当前基线：**57 页中 54 页零残留**，3 页为刻意保留的中文（base64-guide 的「中」字节演示、word-count-guide 的字数规则、/wechat-format/ 的 20 套主题名 + 演示文档 24 行）。

## 六、数据与统计

- **CF Web Analytics**：beacon 由 `site.js` 的 `bindAnalytics()` 统一注入（token 明文出现在源码是 CF 设计，非密钥）；无 cookie，隐私政策已声明
- **自研零依赖 PDF 写入器**（`/pdf/image-to-pdf/` 内联脚本，可复用）：Catalog + Pages + 每页（Page / 内容流 / JPEG XObject）四层结构 + 手工 xref 表；图片统一 Canvas → JPEG → DCTDecode 直嵌字节流（透明铺白底），无需压缩库。**新增 PDF 相关工具直接复用该写入器**；PDF 解析类工具（合并/拆分）需 vendored pdf-lib，属硬约束豁免项，须 Aaron 批准后引入
- **GSC**：`sitemap.xml` 56 URL，全带 hreflang 三连（zh-CN / en `?lang=en` / x-default）
- **Google AdSense**（2026-09-06 接入）：`ca-pub-7103529190038161`；验证代码在全部 **57 个页面**的 `<head>`（含 404；2026-10-13 补齐此前唯一漏掉的 `/barcode/`）；`dist/ads.txt` 已部署（Google 对每个域名独立检查 ads.txt，**根域 cataito.com 的 ads.txt 需在母站部署**）；隐私政策已含广告披露。条目 cataito.com 状态「正在准备→审核中」，过审后广告投放与收益计入该条目
- **og:image 现状（已知缺口）**：仅 6 页（首页 + about/contact/privacy + meta-tags 及其指南）静态写有 `property="og:image"`，其余 49 页由 `site.js` 的 `bindOgImage()` 运行时注入。社交与 AI 抓取器（微信 / X / LinkedIn / Google）**不执行 JS**，这 49 页分享出去无预览图——需静态补齐才算闭环。图片本体已于 2026-10-13 按「中性极简」重制（1200×630，47KB），源文件 `og-image-source.html`（仓库根，不公开），重生成：`chrome --headless=new --window-size=1200,630 --screenshot` 该文件

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

## 十、首页改版触发条件（2026-09-17 锚点）

**当前状态（2026-09-27 更新）**：工具数已达 21，**「工具数 ≥ 20」触发条件已满足并执行改版**：首页工具区按三类别分组（图片与设计 13 / 文本与开发者 7 / PDF 文档 1），`/text/` 与 `/pdf/` 分类 hub 页上线（CollectionPage JSON-LD，sitemap 收录）。印刷工具目录设计语言保持不变，只加分区标题与分类页入口链接。剩余触发条件：工具数 ≥ 30（加搜索框 + 导航重设计）、跳出率 > 70%（加「最近用过的工具」区块）等。

**任一条件满足即启动首页改版（一次性做完）**：

| 触发条件 | 对应改动 |
| --- | --- |
| 工具数 ≥ 20 | 加类别分组 + 类别 hub 页（`/images/`、`/text/` 等） |
| 工具数 ≥ 30 | 加搜索框（兑现首页 JSON-LD 的 SearchAction 声明）+ 导航重设计 |
| 首页跳出率 > 70%（CF Analytics） | 加「最近用过的工具」区块（localStorage） |
| 有付费/订阅功能 | 改版加 CTA |
| 品牌大升级 | 全站重做设计令牌 |

**改版前可做的增量**（不改动布局）：① 某指南页加 HowTo schema ② 首页底部加「同类工具对比」内链 ③ guides/index.html 加「按工具筛选」。

> 决策全文见 `DECISIONS.md`（不入 GitHub），本节是入库版锚点。
