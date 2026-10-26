/* Site sécurité : thème et navigation partagés avec bobine.fit. */
(function () {
  'use strict';
  var options = Array.from(document.querySelectorAll('[data-theme-value]'));
  var THEMES = options.map(function (option) { return option.dataset.themeValue; });
  var LANG = document.documentElement.lang === 'fr' ? 'fr' : 'en';

  // --- Thème : cookie bobine-theme sur .bobine.fit (lu aussi par le site), localStorage en repli ---
  function storedTheme() {
    var match = document.cookie.match(/(?:^|; )bobine-theme=([\w-]+)/);
    var value = match ? match[1] : null;
    try { value = value || localStorage.getItem('bobineweb-theme'); } catch { /* stockage indisponible */ }
    return THEMES.indexOf(value) >= 0 ? value : 'lavande';
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var host = location.hostname;
    var domain = /(^|\.)bobine\.fit$/.test(host) ? '; domain=.bobine.fit' : '';
    document.cookie = 'bobine-theme=' + theme + domain + '; path=/; max-age=31536000; samesite=lax' + (location.protocol === 'https:' ? '; secure' : '');
    try { localStorage.setItem('bobineweb-theme', theme); } catch { /* stockage indisponible */ }
    options.forEach(function (option) {
      var active = option.dataset.themeValue === theme;
      option.setAttribute('aria-selected', String(active));
      option.classList.toggle('is-active', active);
      if (active) {
        document.querySelector('.theme-switcher-btn__label').textContent = option.dataset.label;
        document.querySelector('.theme-swatch-icon').dataset.theme = theme;
        document.getElementById('themeCycle').setAttribute('aria-label', (LANG === 'fr' ? 'Thème actif : ' : 'Current theme: ') + option.dataset.label + (LANG === 'fr' ? '. Thème suivant' : '. Next theme'));
      }
    });
  }
  var picker = document.getElementById('themePicker');
  var palette = document.getElementById('themePalette');
  var toggle = document.getElementById('themeToggle');
  function setGroup(dark) {
    options.forEach(function (option) { option.hidden = (option.dataset.dark === 'true') !== dark; });
    document.querySelectorAll('[data-theme-group]').forEach(function (tab) {
      var active = (tab.dataset.themeGroup === 'dark') === dark;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  }
  function closePalette(focus) {
    palette.hidden = true;
    document.querySelector('.site-header').classList.remove('palette-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('svg').classList.remove('is-open');
    if (focus) toggle.focus();
  }
  toggle.addEventListener('click', function () {
    if (!palette.hidden) { closePalette(false); return; }
    var selected = options.find(function (o) { return o.dataset.themeValue === storedTheme(); });
    setGroup(selected.dataset.dark === 'true');
    document.querySelector('.site-header').classList.add('palette-open');
    palette.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.querySelector('svg').classList.add('is-open');
    selected.focus();
  });
  document.getElementById('themeCycle').addEventListener('click', function () {
    applyTheme(THEMES[(THEMES.indexOf(storedTheme()) + 1) % THEMES.length]);
  });
  options.forEach(function (option) { option.addEventListener('click', function () {
    applyTheme(option.dataset.themeValue); closePalette(true);
  }); });
  document.querySelectorAll('[data-theme-group]').forEach(function (tab) { tab.addEventListener('click', function () { setGroup(tab.dataset.themeGroup === 'dark'); }); });
  document.addEventListener('click', function (event) { if (!picker.contains(event.target)) closePalette(false); });
  document.addEventListener('keydown', function (event) {
    if (palette.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); closePalette(true); return; }
    if (!event.target.matches('[data-theme-value]')) return;
    var visible = options.filter(function (option) { return !option.hidden; });
    var index = visible.indexOf(event.target);
    var offset = {ArrowRight:1, ArrowLeft:-1, ArrowDown:2, ArrowUp:-2}[event.key];
    if (offset !== undefined) { event.preventDefault(); visible[(index + offset + visible.length) % visible.length].focus(); }
    if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); visible[event.key === 'Home' ? 0 : visible.length - 1].focus(); }
  });
  picker.addEventListener('focusout', function (event) { if (event.relatedTarget && !picker.contains(event.relatedTarget)) closePalette(false); });
  applyTheme(storedTheme());

  // --- Menu des petits écrans ---
  var menuBtn = document.getElementById('menuBtn');
  var siteNav = document.getElementById('siteNav');
  if (menuBtn && siteNav) {
    menuBtn.addEventListener('click', function () {
      var open = siteNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && siteNav.classList.contains('is-open')) { siteNav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus(); }
    });
  }


  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      var text = document.getElementById(button.dataset.copy).textContent.trim();
      if (!navigator.clipboard) { document.getElementById('copyStatus').textContent = LANG === 'fr' ? 'Sélectionnez et copiez la commande.' : 'Select and copy the command.'; return; }
      navigator.clipboard.writeText(text).then(function () {
        var label = button.querySelector('.copy-label');
        var original = label.textContent;
        label.textContent = LANG === 'fr' ? 'Copié' : 'Copied';
        document.getElementById('copyStatus').textContent = LANG === 'fr' ? 'Commande copiée' : 'Command copied';
        setTimeout(function () { label.textContent = original; }, 2000);
      }).catch(function () { document.getElementById('copyStatus').textContent = LANG === 'fr' ? 'Sélectionnez et copiez la commande.' : 'Select and copy the command.'; });
    });
  });
})();
