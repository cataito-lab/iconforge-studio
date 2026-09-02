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
    var btn = document.getElementById('lang-switch');
    if (btn) btn.addEventListener('click', function () {
      setLang(getLang() === 'zh' ? 'en' : 'zh');
    });
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
