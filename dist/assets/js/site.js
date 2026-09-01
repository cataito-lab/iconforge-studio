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

    /* 通用 */
    theme_light:    { zh: '亮色', en: 'Light' },
    theme_dark:     { zh: '暗色', en: 'Dark' },

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
        '</nav>' +
        '<button class="lang-switch" id="lang-switch" type="button" aria-label="Switch language">' +
          '<svg class="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>' +
          '<span class="label">EN</span>' +
        '</button>' +
      '</div>';
    var btn = document.getElementById('lang-switch');
    if (btn) btn.addEventListener('click', function () {
      setLang(getLang() === 'zh' ? 'en' : 'zh');
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
