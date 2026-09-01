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

    /* IconForge */
    if_name:        { zh: '图标工坊 IconForge', en: 'Icon Forge' },
    if_desc:        { zh: '上传 Logo，一键导出多尺寸 ICO / PNG / favicon（Light & Dark 双主题）。', en: 'Upload a logo, export multi-size ICO / PNG / favicon with Light & Dark themes.' },
    if_protect:     { zh: '保护', en: 'Padding' },
    if_suffix:      { zh: '主题后缀', en: 'Theme suffix' },
    if_sizes:       { zh: '尺寸', en: 'Sizes' },
    if_generate:    { zh: '一键生成图标资源包', en: 'Generate icon pack' },

    /* Favicon */
    fv_name:        { zh: 'Favicon 生成器', en: 'Favicon Generator' },
    fv_desc:        { zh: '将任意图片生成多尺寸 .ico / .png favicon 包。', en: 'Turn any image into a multi-size .ico / .png favicon pack.' },

    /* 面包屑 */
    crumb_home:     { zh: '首页', en: 'Home' },

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
    document.title = document.querySelector('meta[name="title-' + l + '"]') ?
      document.querySelector('meta[name="title-' + l + '"]').getAttribute('content') : document.title;
  }

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
