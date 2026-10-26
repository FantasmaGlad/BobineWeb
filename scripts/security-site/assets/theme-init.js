document.documentElement.classList.add('js');
(function () {
  try {
    var match = document.cookie.match(/(?:^|; )bobine-theme=([\w-]+)/);
    var theme = (match && match[1]) || localStorage.getItem('bobineweb-theme');
    if (theme) document.documentElement.dataset.theme = theme;
  } catch {}
})();

// Compatibilité des anciens liens français du jeu.
if (location.pathname === '/snake/' && new URLSearchParams(location.search).get('lang') === 'fr') location.replace('/fr/snake/' + location.hash);
