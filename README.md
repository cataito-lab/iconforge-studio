# IconForge Studio v1.1

纯前端、零依赖、完全本地运行的应用图标生成工作台。上传 Logo，一键导出 **ICO / 多尺寸 PNG / favicon**，支持 **Light / Dark 双主题**。所有图像处理均在浏览器本地完成，**图片不会上传到任何服务器**。

## 特性
- 单文件 HTML，无 CDN / 无外部字体 / 无构建步骤，可直接静态托管
- 拖放上传 + 点击选择（真实实现，非装饰）
- 多尺寸（16–1024）PNG、标准 ICO（含 PNG 编码帧，无重复尺寸错帧）、favicon 套件
- ZIP 打包下载（自实现，合法 CRC32 + UTF-8 文件名 + 固定时间戳，跨平台解压无乱码）
- 文件名净化，防止路径穿越
- Light / Dark 主题记忆 + 跟随系统
- 错误用 Toast 提示，不再弹原生 `alert`
- OG / Twitter Card / theme-color 元信息，利于分享与 SEO

## 仓库结构
```
IconForge-Studio-v1.1-fixed.html   # 源文件（开发 / 修改在此）
dist/index.html                    # 部署产物（由源文件复制而来，已 gitignore）
robots.txt                         # 根目录源，构建时复制到 dist/
LICENSE                            # MIT
```

> 注意：`2026-08-20-5d539ce0/`（约 3.28GB 旧构建快照）已被 `.gitignore` 排除，请勿入库。

## 本地预览
直接用浏览器打开 `dist/index.html` 即可。如需本地服务器：
```bash
python -m http.server 8080 --directory dist
# 浏览器访问 http://localhost:8080
```

## 部署（Cloudflare Pages，推荐）

### 方式 A：连接 Git 自动部署（推荐，后续改完即上线）
1. 把本仓库推到 GitHub / GitLab。
2. Cloudflare Pages 控制台 → **Create a project** → 连接仓库。
3. 构建设置：
   - **Build command**：`cp IconForge-Studio-v1.1-fixed.html dist/index.html && cp robots.txt dist/robots.txt`
   - **Output directory**：`dist`
4. 部署完成后，在 **Custom domains** 里添加你的子域名（见下方 DNS）。

### 方式 B：直接上传（无需 Git）
1. Cloudflare Pages → **Create a project** → **Direct Upload**。
2. 直接拖入本地 `dist/` 文件夹（含 `index.html` + `robots.txt`）。
3. 在 **Custom domains** 添加子域名。

### 子域名 DNS 配置
假设你的子域名是 `icons.yourdomain.com`（**请替换成你的真实子域名**）：
1. Cloudflare Pages → 项目 → **Custom domains** → 输入子域名 → 点击 **Activate domain**。
2. 按页面提示，在 Cloudflare DNS 添加一条 **CNAME** 记录：
   - **类型**：`CNAME`
   - **名称**：`icons`（即子域名前缀）
   - **目标**：`<你的 Pages 项目名>.pages.dev`
   - **代理状态**：已代理（橙色云朵 ☁️ 开启，可获免费 HTTPS + 缓存）
3. 等待 DNS 生效（通常几分钟到几小时），Cloudflare 会自动签发 SSL 证书，访问 `https://icons.yourdomain.com` 即可。

> 若你的主域名 DNS 不在 Cloudflare，请先把域名 NS 指向 Cloudflare，或用 Pages 自带的 `*.pages.dev` 域名（无需自有域名）。

## 改动记录（v1.1 上线前修复）
- **P0**：ICO 含 512 尺寸时帧记录冲突 → 已修复（去重，每尺寸唯一帧）
- **P0**：拖放上传原为装饰 → 实现真实 `dragover`/`drop` 文件读取
- **P0**：ZIP 文件名含 `../` 路径穿越 → 文件名净化
- **P1**：ZIP 时间戳固定为 `1980-01-01`（跨平台一致）；`alert` 改 Toast；进度条纳入缩放阶段；补齐 OG/Twitter/favicon 元信息；`:has()` 不支持时降级
- **P2**：`crc32` 改查表法提速；主题记忆 + 跟随系统；SVG 栅格化基准尺寸；移除 Inter 外部字体依赖；`label` 关联；像素量警告阈值修正
