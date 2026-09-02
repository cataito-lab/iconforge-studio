/* ============================================================
   cataito 工具箱 · 全站主题（亮/暗）统一初始化
   - 必须在 <head> 中同步引入（防首屏闪白/闪黑）
   - 存储键：cataito-theme（light/dark），兼容旧键 iconforge-theme
   - 无显式选择时跟随系统 prefers-color-scheme，默认亮色
   - 暴露 window.CATAITO_THEME = { get, set, toggle }
   - 变更时派发 cataito-theme-change 事件（工具页可监听同步 UI）
   ============================================================ */
(function () {
  'use strict';
  var STORE = 'cataito-theme', LEGACY = 'iconforge-theme';
  var current = null;

  function sysDark() {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); } catch (e) { return false; }
  }
  function stored() {
    try {
      var t = localStorage.getItem(STORE) || localStorage.getItem(LEGACY);
      if (t === 'light' || t === 'dark') return t;
    } catch (e) {}
    return null;
  }
  function apply(theme) {
    current = theme;
    var h = document.documentElement;
    if (theme === 'dark') h.classList.add('dark'); else h.classList.remove('dark');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0e1016' : '#fbfbfd');
  }
  function fire() {
    try {
      var e = document.createEvent('Event');
      e.initEvent('cataito-theme-change', true, true);
      document.dispatchEvent(e);
    } catch (e) {}
  }

  apply(stored() || (sysDark() ? 'dark' : 'light'));

  window.CATAITO_THEME = {
    get: function () { return current; },
    set: function (t) {
      if (t !== 'light' && t !== 'dark') return;
      try { localStorage.setItem(STORE, t); } catch (e) {}
      apply(t);
      fire();
    },
    toggle: function () { this.set(current === 'dark' ? 'light' : 'dark'); }
  };

  /* 未做显式选择时，跟随系统实时切换 */
  try {
    var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mq) {
      var onSys = function (e) { if (!stored()) { apply(e.matches ? 'dark' : 'light'); fire(); } };
      if (mq.addEventListener) mq.addEventListener('change', onSys);
      else if (mq.addListener) mq.addListener(onSys);
    }
  } catch (e) {}
})();
