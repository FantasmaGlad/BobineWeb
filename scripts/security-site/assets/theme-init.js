document.documentElement.classList.add('js');
(function () {
  // Données des thèmes (identifiants, anciens noms, défaut) injectées à la construction depuis public/bobine-themes.json.
  var D = /*THEME_DATA*/{};
  window.BOBINE_THEMES = D;
  function cookie(name) { var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([\\w-]+)')); return m && m[1]; }
  function stored(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  var ids = D.themes.map(function (t) { return t.id; });
  var isMode = function (m) { return m === 'light' || m === 'dark' || m === 'auto'; };
  // Ancien nom (valeur « couleur/mode » du JSON) ou nom actuel ; un mode déjà choisi est conservé.
  function resolve() {
    var theme = cookie('bobine-theme') || stored('bobineweb-theme');
    var mode = cookie('bobine-theme-mode') || stored('bobineweb-theme-mode');
    var legacy = theme && D.legacy[theme];
    if (legacy && (ids.indexOf(theme) < 0 || !isMode(mode))) {
      var parts = legacy.split('/');
      theme = parts[0];
      mode = parts[1] ? (mode === 'light' || mode === 'dark' ? mode : parts[1]) : mode;
    }
    if (ids.indexOf(theme) < 0) theme = D.defaultTheme;
    if (!isMode(mode)) mode = D.defaultMode;
    return { theme: theme, mode: mode };
  }
  function effective(mode) { return mode === 'auto' ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode; }
  window.BOBINE_RESOLVE = resolve;
  window.BOBINE_EFFECTIVE = effective;
  try {
    var r = resolve();
    document.documentElement.setAttribute('data-theme', r.theme);
    document.documentElement.setAttribute('data-mode', effective(r.mode));
  } catch (e) {}
})();

// Compatibilité des anciens liens français du jeu.
if (location.pathname === '/snake/' && new URLSearchParams(location.search).get('lang') === 'fr') location.replace('/fr/snake/' + location.hash);
