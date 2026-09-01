# IconForge Studio — 上线前审计报告

审计日期：2026-09-01
审计范围：`C:\Users\83510\Desktop\ico` 全目录
结论：**暂不建议上线**。有 4 个 P0 级功能缺陷，其中 2 个经二进制实测确认，会影响每一个用户的每一次导出。

---

## 修复进度（2026-09-01 更新）

已按「网页版 P0 全修」完成 3 项，改动文件：`IconForge-Studio-v1.1-fixed.html`（53,985 → 57,721 字节）

| P0 | 问题 | 状态 | 验证结果 |
| --- | --- | --- | --- |
| P0-1 | ICO 512 帧误标为 256 | **已修复** | 默认配置下 ICO 现为 7 帧（16/24/32/48/64/128/256），重复尺寸帧为 0；512 改为仅输出 PNG，并在尺寸面板加了说明 |
| P0-2 | 拖放上传未实现 | **已修复** | 两个 dropzone 均已挂 `dragenter/dragover/dragleave/drop`，另加 window 级兜底拦截防止拖到区域外时页面被替换 |
| P0-4 | 文件名未净化（网页版） | **已修复** | 8 个恶意输入用例全部净化为安全名称，详见下方验证记录 |

**未修（属桌面版范围）**：P0-3 单文件夹布局下 light 被 dark 覆盖，待决定桌面版是否继续推进。

### 验证记录

```
[1] 语法检查: PASS（script 共 575 行）

[2] 文件名净化 / 路径穿越防护
   OK  "../../evil"                -> "____evil"
   OK  ".."                        -> "_"
   OK  "..\..\windows\system32"    -> "____windows_system32"
   OK  "My/App"                    -> "My_App"
   OK  "a:b*c?d\"e<f>g|h"          -> "a_b_c_d_e_f_g_h"
   OK  "  .hidden  "               -> "hidden"
   OK  ""                          -> "app-icon"（fallback）
   OK  "正常 应用名"                  -> "正常 应用名"
   结论: PASS 无危险输出

[3] ICO 帧结构复核（修复后）
   帧数=7  reserved=0 type=1
   16 / 24 / 32 / 48 / 64 / 128 / 256(记 0) —— 全部 PNG 编码
   重复尺寸帧: 无 -> 冲突已消除
```

### 改动明细

1. 新增 `sanitizeName(raw, fallback)`——剔连续点、路径分隔符、系统保留字符，截 64 字符，空值回落
2. 新增 `ICO_MAX_SIZE = 256` 与 `icoFrameCanvases()`——ICO 只收 ≤256 的帧；若用户只勾更大尺寸则补一帧 256 保证不为空
3. 新增 `initDropZone()`——拖放事件与高亮态；`window` 级 `dragover/drop` 兜底拦截
4. 重构 `handleFileSelect` → 抽出 `handleFile(file, type, inputEl)`，选择框与拖放共用同一套校验
5. `customName` / `customRoot` 改走净化；自定义目录改为「先判空、再净化」
6. 尺寸面板新增说明行，512/1024 的 title 标注「仅输出 PNG」

---

## 零、先说结论：项目实际有两条产品线

审计前以为只有一个单文件网页版，实际发现两条线并存：

| 产品线 | 位置 | 状态 | 体积 |
| --- | --- | --- | --- |
| **A. 网页单文件版** | `IconForge-Studio-v1.1-fixed.html` | 一直在迭代，8/21 最后修改，功能最完整 | 53 KB |
| **B. Tauri 桌面版** | `2026-08-20-5d539ce0/output/iconforge-studio/` | 完整 React+Rust 工程，**已编译出 exe** | 源码 102 个文件 |
| （B 的可执行产物） | 同目录 `IconForge-Studio.exe` + `iconforge_studio_lib.dll` | 埋在三层深的临时目录里 | 7.9 MB + 116 KB |

桌面版能力更强：支持 ICNS（macOS）、favicon 单独输出、20/22/40/96 等更多尺寸、透明检测与自动去背景。这些是网页版没有的。

**但桌面版 exe 未签名，Windows SmartScreen 必然拦截**，分发体验很差。建议主推网页版，桌面版作为附加下载。

---

## 一、P0 级：阻断上线，必须修

### P0-1 网页版 ICO 在默认配置下就产出错帧（已实测确认）

`IconForge-Studio-v1.1-fixed.html:843-844`

```js
const w = it.width >= 256 ? 0 : it.width;   // 0 在 ICO 规范里代表 256
```

ICO 的目录项宽高各只有 1 字节，规范用 `0` 表示 256。代码把 **≥256 的尺寸一律写成 0**，于是：

- 默认勾选的尺寸是 `16 / 24 / 32 / 48 / 64 / 128 / 256 / 512`
- 256 → 记 0（正确）
- **512 → 也记 0（错误）**
- 结果：ICO 里出现 **两个 256×256 帧**，其中一帧的真实像素是 512×512

实测输出（用真实 PNG 走通 `generateIcoBytes`）：

```
帧6: 头记录=0x0 -> 系统解读=256x256   PNG实际=256x256
帧7: 头记录=0x0 -> 系统解读=256x256   PNG实际=512x512   ← 被误标
!! 尺寸 256x256 出现 2 帧 -> Windows/macOS 只会取其中一帧
```

**影响面：100%。** 默认勾选就是 512，所有不手动改配置的用户都会拿到这个错帧 ICO。

修法：ICO 只打包 ≤256 的尺寸；>256 的仅输出 PNG。同时把 512 / 1024 两个 chip 标注为「PNG only」，并加一句说明。

---

### P0-2 网页版拖放上传是假的，拖文件进页面会丢失已上传内容

`dropzone` 的文案写着「点击或拖入图片」，但全文 grep `dragover | drop | dragenter | preventDefault` **零命中**——只有 `onclick` 打开文件选择器。

后果：用户真去拖文件时，浏览器执行默认行为（直接导航到该图片），**页面被替换，已上传的图和所有设置全部丢失**。

修法：给两个 dropzone 加 `dragover / dragleave / drop` 监听并 `preventDefault()`；同时给 `window` 加兜底防止拖到区域外也导航离开。

---

### P0-3 桌面版在「单文件夹」布局下，light 会被 dark 静默覆盖

`src-tauri/src/file_manager/mod.rs:73-74`

```rust
FolderLayout::Single => PathBuf::from(&file_name),   // 没有 variant 前缀
```

配合 `resolve_base_name`（同文件 14-46 行）：只有 `Themed` 命名规则会给文件名加 `-light` / `-dark` 后缀，`Original` 和 `Custom` 不加。

于是 `Original/Custom + 单文件夹` 组合下，light 和 dark 算出**完全相同的输出路径**，`write_files` 直接覆盖写两次，最终磁盘上只剩一个文件。用户以为生成了双主题，实际只有一份。

修法：单文件夹布局 + 非 Themed 规则时，强制追加 variant 后缀；或在变体展开阶段就跳过重复项。

---

### P0-4 文件名未净化，存在路径穿越

- 网页版：`customName` 直接拼进 ZIP 内路径（`${base}-${size}x${size}.png`），`customRoot` 拼进目录前缀
- 桌面版：`base.join(&f.relative_path)` 直接落盘（Rust 侧 `write_files`）

用户输入 `../../evil` 或 `My/App`，网页版会生成嵌套错乱的 ZIP，桌面版会**写到用户指定的输出目录之外**。

修法：统一净化函数，把 `[^a-zA-Z0-9_\-]` 替换成 `_`，去掉开头 `.`，并做长度截断。

---

## 二、P1 级：上线前强烈建议修

| # | 问题 | 位置 | 说明 |
| --- | --- | --- | --- |
| P1-1 | **单图却生成双份相同的 dark** | `commands.rs:65-68` | 只传 1 张图时，`Original/Custom` 模式仍展开成 light+dark 两变体，产出两份字节相同的文件。实测 `_test_out` 里 **15 个 dark 文件与 light 的 MD5 完全一致**，纯属冗余且误导 |
| P1-2 | **ZIP 时间戳全为 0** | `buildZip` | 实测解压后条目日期为 `1980-00-00`（无效）。DOS date/time 字段没填 |
| P1-3 | 错误提示用 `alert()` | `showError()` | 与整体设计语言割裂，应复用 toast 或做内联错误条 |
| P1-4 | 进度条不含缩放阶段 | `startGeneration` | 8 尺寸 × 2 主题的 `resizeImage` 是同步阻塞，进度从 0 直接跳到「正在打包 ZIP」，又变成"假进度" |
| P1-5 | 无 favicon / description / OG | `<head>` | 一个图标工具自己没有 favicon，说服力弱；分享出去没有卡片。建议内联 SVG data-URI favicon，零外部请求 |
| P1-6 | `:has()` 无降级 | `.chip:has(input:checked)` | 尺寸选中态是核心交互，完全依赖 `:has()`（Firefox 121 以下不支持）。不支持时用户**看不到任何选中反馈**。应加 JS 兜底 class |

---

## 三、P2 级：打磨项

1. `crc32` 逐位实现，大文件偏慢 → 换查表法，约 10x 提升
2. 主题切换无 `localStorage` 记忆，也不跟随系统 `prefers-color-scheme`
3. `font-family` 第一位是 `Inter` 但从未引入，从未生效 → 删掉或改为系统字体栈
4. SVG 源图导出 >512 时会被先栅格化到 512 再放大 → 应按目标尺寸重新栅格化才够锐利
5. `estPeakMB` 阈值 400MB 恒不触发（全选 31 个尺寸才约 11MB），是死代码
6.「保护」下拉框的 `<label>` 没有 `for`，与 `<select>` 无关联
7. `generate` 是 `async` 但没有 `spawn_blocking`，大图处理会卡住 Tauri 主线程
8. `pick_output_folder` 返回 `Ok(None)`，是空壳；`_unused_types()` 是为消警告写的 hack

---

## 四、仓库与发布卫生（不修代码，但影响能否上线）

| 项 | 现状 | 建议 |
| --- | --- | --- |
| **3.28 GB 构建垃圾** | `2026-08-20-5d539ce0/output/` 下 **14,790 个文件**：Rust `.rlib` 1.14 GB、`.rmeta` 673 MB、`.pdb` 513 MB，加 104 个 `node_modules` 包 | 清理，或移出项目目录 |
| **可发布资产被埋没** | `IconForge-Studio.exe` 在三层深的临时目录里 | 提取到 `dist/` 并规范化命名 |
| **无 git 仓库** | 项目根目录没有 `.git` | 上线前必须建，否则无法回滚 |
| **无 LICENSE** | README 写「内部工具，按需配置」 | 公开发布前必须选定 |
| 废弃空目录骨架 | `iconforge-studio/` 下 17 个空目录、0 个文件 | 删除 |
| 重复文件 | 两张截图 MD5 完全相同；`visual_review.md` 有两份 | 去重 |

> 注：以上清理涉及 `Desktop` 下的文件，我未做任何删除操作，等你确认后再动手。

---

## 五、已验证通过的部分

这几块实测没有问题，可以放心：

- **ZIP 二进制生成完全合规**：CRC32 校验通过、UTF-8 中文文件名正常（flag `0x0800`）、嵌套目录正确、内容无误
- **桌面版 ICO 产物完全合规**：11 帧 16→256 全 PNG 编码，头结构正确、偏移对齐、无越界；favicon 单帧 32×32 正确
- **多级降采样缩放算法**实现正确
- **XSS 防护**：所有用户输入走 `innerText` / `value`，无 `innerHTML` 注入点
- **canvas 污染**已捕获并给出明确提示

---

## 六、上线路径建议

**主推网页版，理由：**

1. 零安装、零依赖、完全离线——图片不出本机，这是能写进标题的隐私卖点
2. 53 KB 单文件，可部署到 Cloudflare Pages / GitHub Pages，零成本
3. 可被搜索引擎索引，长期看是引流和变现（AdSense / 付费高级版）的入口
4. 桌面版 exe 未签名，SmartScreen 会拦截，未签名分发体验极差

**桌面版定位：** 作为网页版的「进阶版」下载入口，露出 ICNS / 去背景 / 更多尺寸这些网页版没有的能力，形成升级漏斗。前提是先把 P0-3、P0-4、P1-1 修掉。

**建议节奏：** P0 全修 → 建 git + 定 LICENSE → 清理 3.28 GB 垃圾 → 部署网页版 → 再整桌面版。
