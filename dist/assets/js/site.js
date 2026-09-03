/* ============================================================
   cataito 工具箱 · 共享外壳脚本
   - 注入顶栏（导航 + 语言切换）与页脚
   - 中英双语切换（localStorage 持久化）
   - 元素加 data-i18n="key" 即自动翻译；data-i18n-html 支持内嵌标签
   ============================================================ */
(function () {
  'use strict';

  var I18N = {
    nav_home:       { zh: '首页',   en: 'Home' },
    nav_tools:      { zh: '工具',   en: 'Tools' },
    brand_sub:      { zh: '免费工具箱', en: 'FREE TOOLS' },
    free_badge:     { zh: '100% 免费 · 无需注册 · 浏览器本地处理', en: '100% Free · No sign-up · Runs in your browser' },
    footer_tagline: { zh: '完全免费、纯前端、隐私优先的工具集合。', en: 'Free, client-side, privacy-first tools.' },
    footer_rights:  { zh: '© 2026 cataito. 保留所有权利。', en: '© 2026 cataito. All rights reserved.' },
    footer_sitemap: { zh: '站点地图', en: 'Sitemap' },
    footer_source:  { zh: '开源仓库', en: 'Source' },

    /* 首页 */
    home_title:     { zh: '免费在线工具箱', en: 'Free Online Tools' },
    home_sub:       { zh: '100% 免费、无需注册、在你的浏览器本地运行，图片与数据绝不上传服务器。', en: '100% free, no sign-up, runs entirely in your browser. Your files never leave your device.' },
    home_tools:     { zh: '全部工具', en: 'All tools' },
    home_coming:    { zh: '即将上线', en: 'Coming soon' },
    use_tool:       { zh: '使用工具 →', en: 'Open tool →' },
    back_home:      { zh: '返回首页', en: 'Back to home' },
    home_tool_compress:      { zh: '图片压缩', en: 'Image Compressor' },
    home_tool_compress_desc: { zh: '在线压缩 PNG / JPG / WebP，体积更小、画质可控。', en: 'Compress PNG / JPG / WebP online with smaller size and adjustable quality.' },
    home_tool_palette:       { zh: '配色 / 调色板', en: 'Color Palette' },
    home_tool_palette_desc:  { zh: '从图片提取配色，或生成协调的调色板方案。', en: 'Extract colors from an image or generate a harmonious palette.' },

    /* 首页：关于 / 特性 / FAQ */
    about_h:        { zh: '关于 cataito', en: 'About cataito' },
    about_body:     { zh: '<p>cataito 是一个 100% 免费、隐私优先的在线工具箱，专注于图标与图片处理。所有工具均为纯前端实现——图片在你的浏览器本地完成处理，绝不上传服务器，因此你可以放心处理商业素材与隐私截图。无需注册、无需安装，打开即用。</p><p>我们相信好工具应当零门槛：没有弹窗广告，不收集你的文件，也不强制登录。无论是开发者、设计师，还是偶尔需要做个图标的普通用户，都能在这里快速完成工作。</p>',
                      en: '<p>cataito is a 100% free, privacy-first online toolbox focused on icons and images. Every tool is client-side — your images are processed in your browser and never uploaded, so you can safely handle commercial assets and private screenshots. No sign-up, no install; just open and use.</p><p>We believe good tools should have zero friction: no pop-up ads, no file collection, no forced login. Whether you are a developer, a designer, or someone who just needs an icon now and then, you can get the job done here quickly.</p>' },
    feat_h:         { zh: '核心特性', en: 'Key features' },
    feat_privacy_h: { zh: '隐私优先', en: 'Privacy first' },
    feat_privacy_d: { zh: '纯浏览器本地处理，文件不经过网络，商业素材也能放心用。', en: 'Everything runs locally in your browser; files never touch the network — safe even for commercial assets.' },
    feat_free_h:    { zh: '完全免费', en: 'Completely free' },
    feat_free_d:    { zh: '所有工具 100% 免费，无需注册，没有隐藏收费。', en: 'All tools are 100% free, no sign-up, no hidden fees.' },
    feat_instant_h: { zh: '打开即用', en: 'Open and use' },
    feat_instant_d: { zh: '无需安装，支持 PNG / JPG / WebP / SVG 等主流格式。', en: 'No install needed; supports mainstream formats like PNG / JPG / WebP / SVG.' },
    feat_theme_h:   { zh: '双主题', en: 'Dual theme' },
    feat_theme_d:   { zh: '亮色 / 暗色自动跟随系统，长时间使用不刺眼。', en: 'Light / Dark follows your system automatically, easy on the eyes for long sessions.' },
    faq_h:          { zh: '常见问题', en: 'FAQ' },
    hf_faq_1_q:     { zh: 'cataito 是免费的吗？', en: 'Is cataito free?' },
    hf_faq_1_a:     { zh: '是的。cataito 全部工具 100% 免费、无需注册，所有处理都在你的浏览器本地完成，图片与数据绝不上传服务器。', en: 'Yes. Every cataito tool is 100% free with no sign-up; all processing happens locally in your browser, and your images and data are never uploaded.' },
    hf_faq_2_q:     { zh: '我的图片会被上传到服务器吗？', en: 'Are my images uploaded to a server?' },
    hf_faq_2_a:     { zh: '不会。所有工具基于浏览器本地运算（Canvas / Web API），文件不经过网络，商业素材和隐私截图都能放心使用。', en: 'No. All tools run on in-browser computation (Canvas / Web API); files never cross the network, so commercial assets and private screenshots are safe to use.' },
    hf_faq_3_q:     { zh: '目前提供哪些工具？', en: 'Which tools are available?' },
    hf_faq_3_a:     { zh: '目前提供图标工坊 IconForge、Favicon 生成器、图片压缩、配色 / 调色板四类工具，均为纯前端实现，后续还会持续增加。', en: 'Currently four tools: Icon Forge, Favicon Generator, Image Compressor, and Color Palette — all client-side, with more on the way.' },

    /* IconForge */
    if_name:              { zh: '图标工坊 IconForge', en: 'Icon Forge' },
    if_desc:              { zh: '上传 Logo，一键导出多尺寸 ICO / PNG / favicon（Light & Dark 双主题）。', en: 'Upload a logo, export multi-size ICO / PNG / favicon with Light & Dark themes.' },
    if_light_title:       { zh: 'Light 图标', en: 'Light Icon' },
    if_light_tag:         { zh: '默认 / 通用', en: 'Default / Universal' },
    if_light_drop_title:  { zh: '点击或拖入图片', en: 'Click or drop image' },
    if_light_drop_sub:    { zh: '自动 1:1 纠偏防变形', en: 'Auto 1:1 correction, no distortion' },
    if_dark_title:        { zh: 'Dark 图标', en: 'Dark Icon' },
    if_dark_tag:          { zh: '可选', en: 'Optional' },
    if_dark_drop_title:   { zh: '点击或拖入暗色版', en: 'Click or drop dark version' },
    if_dark_drop_sub:     { zh: '不填则复用 Light', en: 'Reuses Light if empty' },
    if_no_preview:        { zh: '暂无预览', en: 'No preview' },
    if_name_label:        { zh: '应用 / 图标名称', en: 'App / Icon name' },
    if_name_placeholder:  { zh: '例如 ChatGPT', en: 'e.g. ChatGPT' },
    if_name_group:        { zh: '命名', en: 'Naming' },
    if_protect:           { zh: '保护', en: 'Padding' },
    if_contain:           { zh: '等比居中（留白防拉伸）', en: 'Contain (padding, no stretch)' },
    if_fill:              { zh: '强行铺满（可能形变）', en: 'Fill (may distort)' },
    if_suffix:            { zh: '主题后缀', en: 'Theme suffix' },
    if_suffix_hint:       { zh: '生成 Name-light.ico / Name-dark.ico', en: 'Generates Name-light.ico / Name-dark.ico' },
    if_sizes:             { zh: '尺寸', en: 'Sizes' },
    if_choose_sizes:      { zh: '选择需要的尺寸', en: 'Choose sizes' },
    if_select_all:        { zh: '全选', en: 'Select all' },
    if_clear:             { zh: '清空', en: 'Clear' },
    if_ico_limit_hint:    { zh: 'ICO 规范上限为 256px，更大的尺寸只会输出为 PNG，不会写进 ICO。', en: 'ICO spec limits to 256px; larger sizes output as PNG only.' },
    if_format:            { zh: '格式', en: 'Format' },
    if_format_label:      { zh: '输出格式', en: 'Output format' },
    if_format_ico:        { zh: 'ICO（Windows）', en: 'ICO (Windows)' },
    if_format_png:        { zh: 'PNG（多尺寸）', en: 'PNG (multi-size)' },
    if_structure:         { zh: '打包模式', en: 'Packaging' },
    if_structure_label:   { zh: '打包目录模式', en: 'Directory mode' },
    if_structure_flat:    { zh: '单文件夹', en: 'Single folder' },
    if_structure_nested:  { zh: '分类目录 Light/Dark', en: 'Light/Dark folders' },
    if_structure_custom:  { zh: '自定义目录', en: 'Custom folder' },
    if_custom_root_label: { zh: '顶层文件夹名称', en: 'Top folder name' },
    if_custom_root_placeholder: { zh: '例如 MyApp-Icons', en: 'e.g. MyApp-Icons' },
    if_custom_root_hint:  { zh: '所有图标将统一打包进此文件夹。', en: 'All icons will be packed into this folder.' },
    if_generate:          { zh: '一键生成图标资源包', en: 'Generate icon pack' },
    if_engine:            { zh: '渲染引擎：多级降采样抗锯齿重采样（contain / fill 防变形）', en: 'Renderer: multi-step downsample with anti-aliasing (contain / fill, no distortion)' },
    if_waiting_upload:    { zh: '等待上传主图标...', en: 'Waiting for main icon upload...' },
    if_loaded:            { zh: '已载入: ${name} (${w}x${h})', en: 'Loaded: ${name} (${w}x${h})' },
    if_packaging:         { zh: '正在打包图标资源...', en: 'Packing icon assets...' },
    if_progress_ready:    { zh: '准备中...', en: 'Preparing...' },
    if_progress_done:     { zh: '完成', en: 'Done' },
    if_progress_zip:      { zh: '正在打包 ZIP...', en: 'Packing ZIP...' },
    if_progress_scale_light:{ zh: '缩放 Light ${size}×${size}', en: 'Scale Light ${size}×${size}' },
    if_progress_scale_dark:{ zh: '缩放 Dark ${size}×${size}', en: 'Scale Dark ${size}×${size}' },
    if_progress_gen:      { zh: '正在生成 ${label}...', en: 'Generating ${label}...' },
    if_none_selected:     { zh: '未选择', en: 'None selected' },
    if_toast_ok_title:    { zh: '生成成功！', en: 'Generated!' },
    if_toast_ok_sub:      { zh: '压缩包已成功下载', en: 'ZIP downloaded' },
    if_toast_warn_title:  { zh: '生成成功', en: 'Generated' },
    if_toast_warn_sub:    { zh: '压缩包已下载。', en: 'ZIP downloaded. ' },
    if_error_upload_light:{ zh: '请先上传 Light 模式图标文件', en: 'Please upload a Light mode icon first' },
    if_error_choose_size: { zh: '请选择至少一个输出尺寸', en: 'Please choose at least one output size' },
    if_error_choose_format:{ zh: '请至少选择一种输出格式（ICO 或 PNG）', en: 'Please choose at least one output format (ICO or PNG)' },
    if_error_custom_root: { zh: '请输入自定义打包文件夹名称', en: 'Please enter a custom packaging folder name' },
    if_error_invalid_image:{ zh: '请上传有效的图片文件 (PNG/JPG/SVG/WEBP)', en: 'Please upload a valid image file (PNG/JPG/SVG/WEBP)' },
    if_error_svg_parse:   { zh: 'SVG 解析失败：', en: 'SVG parse failed: ' },
    if_error_svg_xml:     { zh: 'XML 解析错误', en: 'XML parse error' },
    if_error_svg_root:    { zh: '未找到 <svg> 根节点', en: '<svg> root not found' },
    if_error_read:        { zh: '文件读取失败，请检查权限。', en: 'File read failed; please check permissions.' },
    if_error_image_load:  { zh: '无法读取该图片，可能是格式损坏或不支持。', en: 'Cannot read image; it may be corrupted or unsupported.' },
    if_error_no_dimension:{ zh: '该图片缺少有效尺寸，导出结果可能异常。', en: 'Image lacks valid dimensions; export may be abnormal.' },
    if_error_tainted:     { zh: '导出失败：素材包含跨域外部资源，浏览器禁止读取像素。请改用纯本地素材后重试。', en: 'Export failed: material contains cross-origin external resources and the browser blocks pixel access. Please use purely local assets.' },
    if_error_pack:        { zh: '打包生成过程中发生错误。', en: 'An error occurred during packaging.' },
    if_error_one_file:    { zh: '一次只能处理一张图片，已取第一张。', en: 'Only one image can be processed at a time; using the first one.' },
    if_error_title:       { zh: '出错了', en: 'Error' },
    if_warn_upscale:      { zh: '源图最长边 ${src}px 低于最大输出 ${max}px，放大后可能模糊。', en: 'Source longest edge ${src}px is smaller than max output ${max}px; upscaling may blur.' },
    if_warn_many_files:   { zh: '本次共 ${n} 个文件，生成可能需要十几秒，请耐心等待。', en: 'This batch has ${n} files; generation may take over ten seconds, please be patient.' },
    if_warn_ico_skip:     { zh: 'ICO 规范上限 ${max}px，${sizes}px 仅输出 PNG。', en: 'ICO spec limits to ${max}px; ${sizes}px output as PNG only.' },
    if_padding_note_contain:{ zh: 'contain 模式：导出为透明留白（非纯色底），预览框底色仅用于对比展示。', en: 'Contain mode: exports with transparent padding (not solid background); preview background is for comparison only.' },
    if_padding_note_fill: { zh: 'fill 模式：图标被拉伸铺满正方形，可能与原图比例不一致。', en: 'Fill mode: icon is stretched to fill the square; aspect ratio may differ.' },

    /* Favicon */
    fv_name:        { zh: 'Favicon 生成器', en: 'Favicon Generator' },
    fv_desc:        { zh: '将任意图片生成多尺寸 .ico / .png favicon 包。', en: 'Turn any image into a multi-size .ico / .png favicon pack.' },
    fv_upload:      { zh: '上传图片', en: 'Upload image' },
    fv_sizes:       { zh: '尺寸', en: 'Sizes' },
    fv_dz_hint:     { zh: 'PNG / JPG / WebP / SVG · 点击或拖入', en: 'PNG / JPG / WebP / SVG · click or drop' },
    fv_generate:    { zh: '生成 favicon 包', en: 'Generate favicon pack' },
    fv_note:        { zh: '全部在浏览器本地完成，图片不会上传。', en: 'Everything runs locally in your browser; images are never uploaded.' },
    fv_toast_img_type:  { zh: '请上传图片文件', en: 'Please upload an image file' },
    fv_toast_img_parse: { zh: '图片解析失败', en: 'Failed to parse image' },
    fv_toast_no_img:    { zh: '请先上传图片', en: 'Please upload an image first' },
    fv_toast_no_size:   { zh: '请至少选择一个尺寸', en: 'Please select at least one size' },
    fv_toast_done:      { zh: '已生成 favicon 包', en: 'Favicon pack generated' },

    /* 面包屑 */
    crumb_home:     { zh: '首页', en: 'Home' },

    /* 指南栏目 */
    nav_guides:         { zh: '使用指南', en: 'Guides' },
    gd_published:       { zh: '发布于', en: 'Published' },
    gd_index_h1:        { zh: '使用指南', en: 'Guides' },
    gd_index_sub:       { zh: '把工具用对、用好：格式原理、尺寸规范与最佳实践。', en: 'Get the most out of the tools: formats, size specs, and best practices.' },
    gd_index_all:       { zh: '全部指南', en: 'All guides' },
    gd_ico_short:       { zh: 'ICO 文件完全指南', en: 'The Complete Guide to ICO Files' },
    gd_ico_h1_short:    { zh: 'ICO 文件完全指南', en: 'The Complete Guide to ICO Files' },
    gd_ico_h1:          { zh: 'ICO 文件完全指南：什么是 .ico、尺寸规范与在线制作方法', en: 'The Complete Guide to ICO Files: What They Are & How to Create Them' },
    gd_ico_sub:         { zh: '一文搞懂 Windows 图标格式：原理、尺寸规范、与 PNG 的区别，以及如何免费在线制作多尺寸 .ico——纯浏览器本地处理。', en: 'Everything about the Windows icon format: how it works, size specs, PNG vs ICO, and how to create multi-size .ico files for free — right in your browser.' },
    gd_ico_card_desc:   { zh: '什么是 .ico、与 PNG 的区别、Windows 尺寸规范（16–256px），以及如何免费在线制作多尺寸 ICO 图标。', en: 'What .ico is, how it differs from PNG, Windows size specs (16–256px), and how to create multi-size ICO files online for free.' },
    gd_fav_short:       { zh: 'Favicon 完全指南', en: 'The Complete Favicon Guide' },
    gd_fav_h1:          { zh: 'Favicon 完全指南：尺寸规范、HTML 写法与在线制作', en: 'The Complete Favicon Guide: Sizes, HTML Code & How to Make One' },
    gd_fav_sub:         { zh: '一文搞定网站小图标：什么是 favicon、全平台尺寸规范、favicon.ico 与 PNG/SVG 的取舍、可直接复制的 HTML 声明代码，以及如何免费在线生成 favicon 包。', en: 'Everything about website favicons: what they are, sizes for every platform, favicon.ico vs PNG vs SVG, copy-paste HTML code, and how to generate a favicon pack for free.' },
    gd_fav_card_desc:   { zh: '全平台 favicon 尺寸规范（16–512px）、favicon.ico 与 PNG/SVG 的取舍、可直接复制的 HTML 声明代码，以及免费在线生成 favicon 包。', en: 'Favicon sizes for every platform (16–512px), favicon.ico vs PNG vs SVG, copy-paste HTML code, and a free online favicon pack generator.' },
    gd_dark_short:      { zh: '暗色图标设计指南', en: 'Dark Mode Icon Design Guide' },
    gd_dark_h1:         { zh: '暗色图标设计指南：深色模式图标怎么做', en: 'Dark Mode Icon Design Guide: Icons for Dark Themes' },
    gd_dark_sub:        { zh: '深色模式已是默认配置，而不是小众选项。本文讲清暗色图标的核心设计原则、app 图标与 favicon 的双变体策略、SVG 跟随系统深色模式的写法，以及一键生成 Light/Dark 双主题图标的方法。', en: 'Dark mode is now the default, not a niche option. Core principles of dark icon design, dual-variant strategies for app icons and favicons, SVG media queries, and how to generate Light/Dark icon sets in one click.' },
    gd_dark_card_desc:  { zh: '深色模式图标怎么做：对比度、亮度分层、强调色提亮三大原则，app 图标与 favicon 的双变体策略，以及一键生成 Light/Dark 双主题图标。', en: 'How to design icons for dark mode: contrast, luminance layering, and accent brightening, plus dual-variant strategies and one-click Light/Dark generation.' },
    gd_comp_short:      { zh: '图片压缩指南', en: 'Image Compression Guide' },
    gd_comp_h1:         { zh: '图片压缩指南：JPG、PNG、WebP 怎么选与怎么压得最小', en: 'Image Compression Guide: JPEG vs PNG vs WebP & How to Shrink Images' },
    gd_comp_sub:        { zh: '图片往往是网页里最占流量的资源。本文讲清三种主流格式的取舍、有损与无损的区别、质量参数怎么选、尺寸限制的技巧，以及如何免费在线批量压缩图片——纯浏览器本地处理。', en: 'Images are often the heaviest resource on a page. Format trade-offs, lossy vs lossless, quality settings, max-edge tricks, and how to batch-compress images for free — right in your browser.' },
    gd_comp_card_desc:  { zh: 'JPG、PNG、WebP 三种格式怎么选、质量参数怎么调、最长边限制的技巧，以及免费在线批量压缩图片（透明自动保留）。', en: 'Choosing between JPEG/PNG/WebP, quality settings, max-edge limits, and free online batch compression with transparency preserved.' },
    gd_webp_short:      { zh: 'WebP 格式指南', en: 'WebP Format Guide' },
    gd_webp_h1:         { zh: 'WebP 格式指南：比 JPEG/PNG 更小、何时用、怎么转', en: 'WebP Format Guide: Smaller than JPEG/PNG, When to Use, How to Convert' },
    gd_webp_sub:        { zh: 'WebP 是谷歌推出的现代图片格式，同等画质下体积通常比 JPEG/PNG 小 25–35%。本文讲清 WebP 是什么、为什么更小、哪些场景该用、浏览器兼容性，以及如何免费在线把图片转成 WebP——纯浏览器本地处理。', en: 'WebP is a modern image format from Google, typically 25–35% smaller than JPEG/PNG at equal quality. This guide covers what WebP is, why it is smaller, when to use it, browser support, and how to convert images to WebP for free — entirely in your browser.' },
    gd_webp_card_desc:  { zh: 'WebP 是什么、为什么比 JPEG/PNG 更小、何时该用、浏览器兼容性，以及如何免费在线转 WebP（透明自动保留）。', en: 'What WebP is, why it beats JPEG/PNG on size, when to use it, browser support, and free online WebP conversion with transparency preserved.' },

    /* 通用 */
    theme_light:    { zh: '亮色', en: 'Light' },
    theme_dark:     { zh: '暗色', en: 'Dark' },
    theme_toggle:   { zh: '切换亮/暗主题', en: 'Toggle light/dark theme' },

    /* 图片压缩 */
    cp_name:          { zh: '图片压缩', en: 'Image Compressor' },
    cp_desc:          { zh: '在线压缩 JPG / PNG / WebP：自由调质量、控尺寸，一键批量打包下载。纯浏览器本地处理。', en: 'Compress JPG / PNG / WebP online: adjustable quality and size, batch download as ZIP. Runs entirely in your browser.' },
    cp_upload:        { zh: '点击或拖入图片（可多选）', en: 'Click or drop images (multiple allowed)' },
    cp_dz_hint:      { zh: 'JPG / PNG / WebP · 全程本地处理，不上传', en: 'JPG / PNG / WebP · 100% local, never uploaded' },
    cp_quality:       { zh: '压缩质量', en: 'Quality' },
    cp_quality_hint:  { zh: '数值越低体积越小，画质越低。推荐 70–85。', en: 'Lower = smaller files, lower fidelity. 70–85 recommended.' },
    cp_format:        { zh: '输出格式', en: 'Output format' },
    cp_fmt_auto:      { zh: '智能（自动选最小）', en: 'Smart (smallest)' },
    cp_fmt_jpeg:      { zh: 'JPEG', en: 'JPEG' },
    cp_fmt_webp:      { zh: 'WebP（更小）', en: 'WebP (smaller)' },
    cp_fmt_png:       { zh: 'PNG（无损，体积可能不减）', en: 'PNG (lossless, may not shrink)' },
    cp_maxedge:       { zh: '最长边限制', en: 'Max edge' },
    cp_edge_orig:     { zh: '原始尺寸', en: 'Original' },
    cp_note:          { zh: 'JPEG/WebP 为有损压缩；含透明通道的图片会自动保留透明（输出 WebP/PNG）。', en: 'JPEG/WebP are lossy; images with transparency keep alpha automatically (WebP/PNG output).' },
    cp_download_all:  { zh: '打包下载全部（ZIP）', en: 'Download all (ZIP)' },
    cp_empty:         { zh: '还没有图片，先上传几张试试。', en: 'No images yet — drop some to start.' },
    cp_total:         { zh: '共 ${n} 张 · ${saved}', en: '${n} images · ${saved}' },
    cp_saved_percent: { zh: '总体减小 ${p}%', en: '${p}% smaller overall' },
    cp_grew:          { zh: '该图已无法再小，保留原图', en: 'Already optimal; original kept' },
    cp_dl:            { zh: '下载', en: 'Download' },
    cp_remove:        { zh: '移除', en: 'Remove' },
    cp_toast_type:    { zh: '请上传图片文件', en: 'Please upload image files' },
    cp_toast_too_many:{ zh: '一次最多 ${n} 张，超出部分已忽略', en: 'Up to ${n} images at once; extras skipped' },
    cp_toast_empty:   { zh: '请先添加图片', en: 'Please add images first' },
    cp_toast_zip:     { zh: 'ZIP 已开始下载', en: 'ZIP download started' },
    cp_add_more:      { zh: '继续添加', en: 'Add more' },
    cp_clear_all:     { zh: '清空全部', en: 'Clear all' },
    cp_compressing:   { zh: '压缩中...', en: 'Compressing...' },
    cp_orig:          { zh: '原图', en: 'Original' },
    cp_new:           { zh: '压缩后', en: 'Compressed' },

    /* ---- 工具页底部内容板块（补可索引正文 + 工具→指南反向内链） ---- */
    related_guides: { zh: '相关指南', en: 'Related guides' },

    cp_how_h:  { zh: '怎么用', en: 'How to use' },
    cp_how_1:  { zh: '<strong>批量上传</strong>：点击或拖入图片，一次最多 20 张，JPG / PNG / WebP 都可以。', en: '<strong>Batch upload</strong>: click or drag in images, up to 20 at a time — JPG / PNG / WebP all supported.' },
    cp_how_2:  { zh: '<strong>调整参数</strong>：质量默认 80（推荐 70–85）；格式选「智能」由工具自动择小；最长边按用途选择。', en: '<strong>Tune settings</strong>: quality defaults to 80 (70–85 recommended); pick "Smart" format and let the tool choose the smallest; set the max edge by use case.' },
    cp_how_3:  { zh: '<strong>核对结果</strong>：每行显示压缩前后体积与节省比例，含透明的图片会自动保留透明通道。', en: '<strong>Review results</strong>: each row shows before/after size and savings; transparent images keep their alpha channel automatically.' },
    cp_how_4:  { zh: '<strong>下载</strong>：单张逐个下载，或一键打包全部为 ZIP。', en: '<strong>Download</strong>: grab files one by one, or export everything as a single ZIP.' },
    cp_faq_h:  { zh: '常见问题', en: 'FAQ' },
    cp_faq_1_q: { zh: '图片会被上传到服务器吗？', en: 'Are my images uploaded to a server?' },
    cp_faq_1_a: { zh: '不会。全部处理在浏览器本地完成（Canvas 编码），图片不经过网络，商业素材和隐私截图都可以放心用。', en: 'No. Everything runs locally in your browser (Canvas encoding) — images never touch the network, safe for commercial assets and private screenshots.' },
    cp_faq_2_q: { zh: '为什么有的图片压缩后反而变大了？', en: 'Why did some images get bigger after compressing?' },
    cp_faq_2_a: { zh: '本身已是高度优化的文件（例如原本就是 WebP）再编码可能更大。工具会自动检测并保留原图，不会让你下载更差的版本。', en: 'Files that are already highly optimized (native WebP, for example) can re-encode larger. The tool detects this and keeps the original — you never download a worse version.' },
    cp_faq_3_q: { zh: '质量该设多少？', en: 'What quality setting should I use?' },
    cp_faq_3_a: { zh: '网页展示推荐 70–85：低于 60 容易出现块状伪影，高于 90 体积涨得快但肉眼几乎看不出差别。人物特写可调高，缩略图可更低。', en: 'For web display, 70–85: below 60 risks blocky artifacts; above 90 grows files fast with no visible gain. Portraits can go higher, thumbnails lower.' },
    cp_faq_4_q: { zh: '透明背景会丢失吗？', en: 'Will transparency be lost?' },
    cp_faq_4_a: { zh: '不会。工具会先检测图片是否含透明通道，含透明时输出 WebP 或 PNG 保留 alpha，不会转成会变白底的 JPEG。', en: 'No. The tool checks for an alpha channel first and outputs WebP or PNG to preserve it — it never converts to JPEG, which would flatten to white.' },

    fv_how_h:  { zh: '怎么用', en: 'How to use' },
    fv_how_1:  { zh: '<strong>上传一张图</strong>：PNG / JPG / WebP / SVG 都可以，建议用正方形、主体居中的版本。', en: '<strong>Upload an image</strong>: PNG / JPG / WebP / SVG all work; a square, centered version gives the best result.' },
    fv_how_2:  { zh: '<strong>勾选尺寸</strong>：默认已选中全平台常用档位（16 至 512px），可按需增减。', en: '<strong>Pick sizes</strong>: the common cross-platform range (16 to 512px) is preselected — add or remove as needed.' },
    fv_how_3:  { zh: '<strong>生成并下载</strong>：点击生成，得到打包好的 favicon 套件，解压后按说明放进网站根目录。', en: '<strong>Generate and download</strong>: click generate to get a packed favicon set, then drop the files into your site root as described in the guide.' },
    fv_faq_h:  { zh: '常见问题', en: 'FAQ' },
    fv_faq_1_q: { zh: '生成的文件要放在哪里？', en: 'Where do the generated files go?' },
    fv_faq_1_a: { zh: '通常放进网站根目录（与 index.html 同级），浏览器会自动请求 /favicon.ico。PNG 版本则需在 HTML 的 head 里显式声明，写法见下方指南。', en: 'Usually in your site root (alongside index.html) — browsers request /favicon.ico automatically. PNG variants need explicit declarations in the HTML head; see the guide below.' },
    fv_faq_2_q: { zh: 'favicon.ico 和 PNG favicon 有什么区别？', en: "What's the difference between favicon.ico and PNG favicons?" },
    fv_faq_2_a: { zh: 'ICO 是老牌通用格式，兼容性最好，还能在一个文件里塞多个尺寸；PNG 体积更小、支持透明，是现代浏览器的首选。稳妥做法是两者都提供。', en: 'ICO is the legacy universal format with the broadest support and can pack multiple sizes in one file; PNG is smaller and supports transparency, preferred by modern browsers. Safest bet: provide both.' },
    fv_faq_3_q: { zh: '为什么改了 favicon 但浏览器还显示旧的？', en: 'Why does my browser still show the old favicon?' },
    fv_faq_3_a: { zh: '浏览器会强缓存 favicon。强制刷新（Ctrl/Cmd + Shift + R）通常能解决；站点若用了 CDN，还需要清一次 CDN 缓存。', en: 'Browsers cache favicons aggressively. A hard refresh (Ctrl/Cmd + Shift + R) usually fixes it; with a CDN in front, purge the CDN cache too.' },

    if_how_h:  { zh: '怎么用', en: 'How to use' },
    if_how_1:  { zh: '<strong>上传主图标</strong>：点击或拖入一张 Logo（PNG/JPG/WebP/SVG 均可），工具自动做 1:1 纠偏，非正方形也不会变形。', en: '<strong>Upload your main icon</strong>: click or drag in a logo (PNG/JPG/WebP/SVG); the tool auto-corrects to 1:1, so non-square sources never distort.' },
    if_how_2:  { zh: '<strong>可选暗色版</strong>：若有单独的深色版本，上传到 Dark 变体；不上传则复用 Light 版。', en: '<strong>Optional dark variant</strong>: if you have a separate dark version, upload it as the Dark variant; otherwise the Light one is reused.' },
    if_how_3:  { zh: '<strong>选择尺寸与格式</strong>：默认勾选 16–256px 全部档位，可输出 ICO（Windows）与多尺寸 PNG。', en: '<strong>Choose sizes and formats</strong>: all 16–256px steps are preselected; output ICO (Windows) plus per-size PNGs.' },
    if_how_4:  { zh: '<strong>生成并下载</strong>：一键打包为 ZIP，支持单文件夹、Light/Dark 分类目录或自定义顶层目录。', en: '<strong>Generate and download</strong>: one click packs a ZIP — flat folder, Light/Dark split, or a custom top-level directory.' },
    if_faq_h:  { zh: '常见问题', en: 'FAQ' },
    if_faq_1_q: { zh: '.ico 和 .png 图标有什么区别？', en: "What's the difference between .ico and .png icons?" },
    if_faq_1_a: { zh: 'ICO 是 Windows 的图标容器格式，一个文件可包含多个尺寸，系统按需要自动取用；PNG 是单一尺寸的图像文件，通用性更强。做 Windows 应用图标必须提供 ICO，网页端用 PNG 即可。', en: 'ICO is the Windows icon container: one file can hold multiple sizes, and the system picks the right one. PNG is a single-size image with broader general use. Windows app icons require ICO; PNG is enough for the web.' },
    if_faq_2_q: { zh: '非正方形的 Logo 会被拉伸吗？', en: 'Will a non-square logo get stretched?' },
    if_faq_2_a: { zh: '不会。默认「等比居中」模式会把图像缩放到目标尺寸内并居中，四周留透明或背景色；若确实需要铺满，可切换到「强行铺满」，但可能形变。', en: 'No. The default "fit and center" mode scales the image inside the target size and centers it with transparent or background padding. Switch to "fill" if you truly need edge-to-edge — at the risk of distortion.' },
    if_faq_3_q: { zh: '一个 ICO 里能同时放明暗两个版本吗？', en: 'Can one ICO hold both light and dark versions?' },
    if_faq_3_a: { zh: '不能。ICO 是多尺寸容器，同一尺寸只能存一张图。明暗双主题请导出两组文件，或改用带媒体查询的 SVG 在一个文件内切换。', en: "No. ICO is a multi-size container — one image per size. For dual themes, export two sets, or use an SVG with media queries to switch inside one file." },
    if_faq_4_q: { zh: '图片会被上传到服务器吗？', en: 'Are my images uploaded to a server?' },
    if_faq_4_a: { zh: '不会。全部处理在浏览器本地完成，图片不经过网络，商业 Logo 也能放心使用。', en: 'No. Everything runs locally in your browser — images never touch the network, safe even for commercial logos.' },

    /* 工具四：配色 / 调色板 */
    pl_name:         { zh: '配色工具', en: 'Color Palette Generator' },
    pl_desc:         { zh: '上传图片自动提取主色调，一键生成协调的配色方案，复制色值或导出 CSS 变量。纯浏览器本地处理。', en: 'Upload an image to extract its dominant colors, generate harmonious schemes, copy values or export CSS variables. Runs entirely in your browser.' },
    pl_upload:       { zh: '点击或拖入图片', en: 'Click or drop an image' },
    pl_dz_hint:      { zh: 'PNG / JPG / WebP / SVG · 全程本地处理，不上传', en: 'PNG / JPG / WebP / SVG · processed locally, never uploaded' },
    pl_count:        { zh: '提取颜色数', en: 'Number of colors' },
    pl_scheme:       { zh: '配色方案', en: 'Color scheme' },
    pl_scheme_none:  { zh: '仅主色', en: 'Dominant only' },
    pl_scheme_comp:  { zh: '互补色', en: 'Complementary' },
    pl_scheme_analog:{ zh: '类似色', en: 'Analogous' },
    pl_scheme_tri:   { zh: '三角配色', en: 'Triadic' },
    pl_scheme_mono:  { zh: '单色阶', en: 'Monochrome' },
    pl_scheme_hint:  { zh: '配色方案基于图片主色生成，适合延展品牌色或做 UI 配色。', en: 'Schemes are derived from the dominant color — handy for extending a brand color or building a UI palette.' },
    pl_empty:        { zh: '还没有图片，上传一张看看它的主色调。', en: 'No image yet — upload one to see its dominant colors.' },
    pl_copy_hex:     { zh: '复制全部 HEX', en: 'Copy all HEX' },
    pl_copy_css:     { zh: '复制 CSS 变量', en: 'Copy CSS variables' },
    pl_download_png: { zh: '下载色卡 PNG', en: 'Download swatch PNG' },
    pl_note:         { zh: '颜色由中位切分法（median cut）从图片像素统计得出，占比越高越靠前；点击任意色块即可复制色值。', en: 'Colors come from median-cut quantization of the image pixels, ordered by share; click any swatch to copy its value.' },
    pl_stats:        { zh: '共 ${n} 个颜色', en: '${n} colors' },
    pl_copy_hint:    { zh: '点击复制色值', en: 'Click to copy' },
    pl_how_h:        { zh: '怎么用', en: 'How to use' },
    pl_how_1:        { zh: '<strong>上传一张图</strong>：照片、插画、品牌 Logo 都可以，工具会统计像素分布。', en: '<strong>Upload an image</strong>: photos, illustrations, brand logos — the tool analyzes the pixel distribution.' },
    pl_how_2:        { zh: '<strong>设定数量</strong>：选择提取 4 到 10 个主色，数量越多层次越细腻。', en: '<strong>Pick a count</strong>: extract 4 to 10 dominant colors — more colors means finer gradation.' },
    pl_how_3:        { zh: '<strong>选配色方案</strong>：在提取的主色之外，可基于主色生成互补、类似、三角或单色阶方案。', en: '<strong>Choose a scheme</strong>: beyond the raw colors, generate complementary, analogous, triadic or monochrome sets from the dominant color.' },
    pl_how_4:        { zh: '<strong>导出使用</strong>：点击色块复制单个色值，或一键复制全部 HEX、CSS 变量，也可下载 PNG 色卡。', en: '<strong>Export</strong>: click a swatch to copy one value, or copy all HEX / CSS variables at once and download a PNG swatch card.' },
    pl_faq_h:        { zh: '常见问题', en: 'FAQ' },
    pl_faq_1_q:      { zh: '主色是怎么算出来的？', en: 'How are the dominant colors calculated?' },
    pl_faq_1_a:      { zh: '用中位切分法（median cut）：把图片缩放到小尺寸后统计所有像素，反复沿颜色跨度最大的通道切分，直到得到指定数量的色组，每组取平均色作为代表色，再按像素占比排序。', en: 'Using median cut: the image is scaled down and all pixels are counted, then repeatedly split along the widest color channel until the requested number of buckets is reached. Each bucket averages to a representative color, then results are sorted by pixel share.' },
    pl_faq_2_q:      { zh: '图片会被上传到服务器吗？', en: 'Are my images uploaded to a server?' },
    pl_faq_2_a:      { zh: '不会。取色在浏览器本地通过 Canvas 完成，图片不经过网络，商业素材和未发布的品牌图都能放心用。', en: 'No. Extraction happens locally via Canvas — images never touch the network, safe for commercial assets and unreleased brand work.' },
    pl_faq_3_q:      { zh: '互补色、类似色、三角配色有什么区别？', en: "What's the difference between complementary, analogous and triadic?" },
    pl_faq_3_a:      { zh: '互补色取色轮上相对 180° 的颜色，对比强烈适合强调；类似色取相邻 30° 左右，柔和统一；三角配色取相隔 120° 的三色，丰富而平衡；单色阶只改明度与饱和度，最安全不出错。', en: 'Complementary sits 180° opposite on the wheel — high contrast, good for emphasis. Analogous takes neighbors about 30° apart — soft and unified. Triadic uses three colors 120° apart — rich yet balanced. Monochrome varies only lightness and saturation — the safest choice.' },
    pl_faq_4_q:      { zh: '提取的颜色可以直接做品牌色吗？', en: 'Can I use the extracted colors as brand colors directly?' },
    pl_faq_4_a:      { zh: '建议以它为起点再手动微调：算法提取的是统计意义上的平均色，通常会略微发灰，实际使用时可适度提高饱和度，并在深浅背景下各验证一次对比度。', en: 'Treat them as a starting point: the algorithm produces statistical averages that tend to look slightly desaturated. Bump saturation a little and check contrast on both light and dark backgrounds.' },
    pl_toast_type:      { zh: '请上传图片文件', en: 'Please upload an image file' },
    pl_toast_done:      { zh: '已提取 ${n} 个颜色', en: 'Extracted ${n} colors' },
    pl_toast_load_fail: { zh: '图片读取失败，换一张试试', en: 'Could not read that image — try another' },
    pl_toast_read_fail: { zh: '无法读取像素，请换一张图片', en: 'Could not read pixels — try another image' },
    pl_toast_copied:    { zh: '已复制 ${c}', en: 'Copied ${c}' },
    pl_toast_copied_all:{ zh: '已复制全部色值', en: 'All color values copied' },
    pl_toast_copied_css:{ zh: '已复制 CSS 变量', en: 'CSS variables copied' },
    pl_toast_png:       { zh: '色卡 PNG 已开始下载', en: 'Swatch PNG download started' },
    pl_toast_png_fail:  { zh: '色卡生成失败，请重试', en: 'Failed to generate swatch — please retry' },
    pl_toast_copy_fail: { zh: '复制失败，请手动选择复制', en: 'Copy failed — please copy manually' },

    /* 语言按钮（显示“切换到”的目标语言） */
    lang_to_en:     { zh: 'EN', en: '中' }
  };

  var LANGS = ['zh', 'en'];
  function getLang() {
    try {
      var l = localStorage.getItem('cataito-lang');
      if (l && LANGS.indexOf(l) >= 0) return l;
    } catch (e) {}
    return 'zh';
  }
  function setLang(l) {
    try { localStorage.setItem('cataito-lang', l); } catch (e) {}
    document.documentElement.setAttribute('lang', l === 'en' ? 'en' : 'zh-CN');
    applyI18n(l);
    var btn = document.querySelector('.lang-switch .label');
    if (btn) btn.textContent = I18N.lang_to_en[l];
    document.documentElement.classList.toggle('lang-en', l === 'en');
    try {
      var ev = document.createEvent('Event');
      ev.initEvent('cataito-lang-change', true, true);
      document.dispatchEvent(ev);
    } catch (e) {}
  }
  function applyI18n(l) {
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      if (I18N[key] && I18N[key][l] != null) nodes[i].textContent = I18N[key][l];
    }
    var hnodes = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < hnodes.length; j++) {
      var k = hnodes[j].getAttribute('data-i18n-html');
      if (I18N[k] && I18N[k][l] != null) hnodes[j].innerHTML = I18N[k][l];
    }
    var pnodes = document.querySelectorAll('[data-i18n-placeholder]');
    for (var p = 0; p < pnodes.length; p++) {
      var pk = pnodes[p].getAttribute('data-i18n-placeholder');
      if (I18N[pk] && I18N[pk][l] != null) pnodes[p].setAttribute('placeholder', I18N[pk][l]);
    }
    var tnodes = document.querySelectorAll('[data-i18n-title]');
    for (var t = 0; t < tnodes.length; t++) {
      var tk = tnodes[t].getAttribute('data-i18n-title');
      if (I18N[tk] && I18N[tk][l] != null) tnodes[t].setAttribute('title', I18N[tk][l]);
    }
    document.title = document.querySelector('meta[name="title-' + l + '"]') ?
      document.querySelector('meta[name="title-' + l + '"]').getAttribute('content') : document.title;
  }

  /* 暴露给工具页内部脚本做运行时翻译（含简单 ${var} 插值） */
  function t(key, vars) {
    var lang = getLang();
    if (!I18N[key] || I18N[key][lang] == null) return '';
    var s = I18N[key][lang];
    if (vars) {
      for (var k in vars) {
        if (Object.prototype.hasOwnProperty.call(vars, k)) {
          s = s.replace(new RegExp('\\$\\{' + k + '\\}', 'g'), vars[k]);
        }
      }
    }
    return s;
  }
  window.CATAITO_I18N = { t: t, getLang: getLang, setLang: setLang, apply: applyI18n };

  var MARK = '<svg width="18" height="18" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="7" fill="#fff"/><rect x="8" y="8" width="7" height="7" rx="1.5" fill="#6366f1"/><rect x="17" y="8" width="7" height="7" rx="1.5" fill="#6366f1" opacity=".55"/><rect x="8" y="17" width="7" height="7" rx="1.5" fill="#6366f1" opacity=".55"/><rect x="17" y="17" width="7" height="7" rx="1.5" fill="#6366f1" opacity=".3"/></svg>';

  function renderHeader() {
    var el = document.getElementById('site-header');
    if (!el) return;
    var path = location.pathname.replace(/index\.html$/, '');
    function active(href) {
      if (href === '/') return path === '/' || path === '';
      return path.indexOf(href) === 0;
    }
    el.innerHTML =
      '<div class="site-header__inner">' +
        '<a class="brand" href="/" data-i18n-html="brand_html">' +
          '<span class="brand__mark">' + MARK + '</span>' +
          '<span class="brand__name">cataito<span class="brand__sub" data-i18n="brand_sub">免费工具箱</span></span>' +
        '</a>' +
        '<nav class="nav">' +
          '<a href="/" class="' + (active('/') ? 'active' : '') + '" data-i18n="nav_home">首页</a>' +
          '<a href="/icon-forge/" class="' + (active('/icon-forge/') ? 'active' : '') + '" data-i18n="if_name">图标工坊 IconForge</a>' +
          '<a href="/favicon/" class="' + (active('/favicon/') ? 'active' : '') + '" data-i18n="fv_name">Favicon 生成器</a>' +
          '<a href="/compress/" class="' + (active('/compress/') ? 'active' : '') + '" data-i18n="cp_name">图片压缩</a>' +
          '<a href="/palette/" class="' + (active('/palette/') ? 'active' : '') + '" data-i18n="pl_name">配色工具</a>' +
          '<a href="/guides/" class="' + (active('/guides/') ? 'active' : '') + '" data-i18n="nav_guides">使用指南</a>' +
        '</nav>' +
        '<div class="header-actions">' +
          '<button class="theme-switch" id="theme-switch" type="button" data-i18n-title="theme_toggle" aria-label="Toggle theme">' +
            '<svg class="ico-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>' +
            '<svg class="ico-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>' +
          '</button>' +
          '<button class="lang-switch" id="lang-switch" type="button" aria-label="Switch language">' +
            '<svg class="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>' +
            '<span class="label">EN</span>' +
          '</button>' +
        '</div>' +
      '</div>';
    /* 语言按钮的点击统一由 bindLangSwitch() 绑定（带 dataset.bound 幂等保护）。
       此处若再绑一次，一次点击会触发两次切换而互相抵消，按钮看起来完全失效。 */
    var tbtn = document.getElementById('theme-switch');
    if (tbtn) tbtn.addEventListener('click', function () {
      if (window.CATAITO_THEME) window.CATAITO_THEME.toggle();
    });
  }

  function renderFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return;
    var y = new Date().getFullYear();
    el.innerHTML =
      '<div class="site-footer__inner">' +
        '<div data-i18n="footer_tagline">完全免费、纯前端、隐私优先的工具集合。</div>' +
        '<div class="site-footer__links">' +
          '<a href="/sitemap.xml" data-i18n="footer_sitemap">站点地图</a>' +
          '<a href="https://github.com/cataito-lab/iconforge-studio" target="_blank" rel="noopener" data-i18n="footer_source">开源仓库</a>' +
          '<span>© ' + y + ' cataito</span>' +
        '</div>' +
      '</div>';
  }

  function bindLangSwitch() {
    var b = document.getElementById('lang-switch');
    if (b && !b.dataset.bound) {
      b.dataset.bound = '1';
      b.addEventListener('click', function () { setLang(getLang() === 'zh' ? 'en' : 'zh'); });
    }
  }

  /* :has() 降级兜底
     选中态主要依赖 CSS :has()，Firefox 121 以下完全看不到选中反馈。
     这里统一给所有 .t-chip / .t-seg-item 补 .checked 类（CSS 里已并列支持）。
     各工具页动态生成的控件也覆盖：MutationObserver 监听 document 变更。 */
  function initHasFallback() {
    var supported = false;
    try { supported = !!(window.CSS && CSS.supports && CSS.supports('selector(:has(input:checked))')); } catch (e) { supported = false; }
    if (supported) return;
    function syncOne(inp) {
      var host = inp.closest('.t-chip, .t-seg-item');
      if (host) host.classList.toggle('checked', inp.checked);
    }
    function syncAll() {
      var list = document.querySelectorAll('.t-chip input, .t-seg-item input');
      for (var i = 0; i < list.length; i++) syncOne(list[i]);
    }
    document.addEventListener('change', function (e) {
      var el = e.target;
      if (el.matches && el.matches('.t-chip input, .t-seg-item input')) syncOne(el);
    });
    if (window.MutationObserver) {
      new MutationObserver(syncAll).observe(document.body, { childList: true, subtree: true });
    }
    syncAll();
  }

  function init() {
    /* 支持 ?lang=en / ?lang=zh URL 参数（供 sitemap hreflang 备选 URL 与外链直开指定语言） */
    try {
      var m = location.search.match(/[?&]lang=(en|zh)(?:&|$)/);
      if (m) {
        try { localStorage.setItem('cataito-lang', m[1]); } catch (e) {}
      }
    } catch (e) {}
    renderHeader();
    renderFooter();
    bindLangSwitch();
    setLang(getLang());
    initHasFallback();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
