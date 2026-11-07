(function () {
  var LANG = 'fr';
  var T = { fr: { dlTitle: function (ext, arch) { return 'Paquet direct (' + ext + ', ' + arch + ')'; }, dlMeta: { debian: 'x' }, dlBtn: function (ext) { return 'Télécharger le ' + ext; } } }[LANG];
  var RELEASES = 'https://github.com/FantasmaGlad/Bobine/releases/download';
  var state = { distro: 'debian', channel: 'stable', arch: 'x86_64', dnf: 'dnf5', version: '5.0.5' };

  function commands() {
    var ch = state.channel;
    return [
      { comment: '# 1', cmd: 'curl -fsSL https://packages.bobine.fit/bobine.gpg | sudo gpg --dearmor' },
      { comment: '# 2', cmd: 'echo "deb https://packages.bobine.fit/debian ' + ch + ' main"' }
    ];
  }

  // Noms de fichiers publiés par la CI de Bobine (mêmes conventions que le site bobine.fit).
  function direct() {
    var ch = state.channel;
    return { ext: '.deb', arch: 'amd64', url: RELEASES + '/V5/bobine.deb' };
  }

  function render() {
    document.getElementById('dlTitle').textContent = T.dlTitle(d.ext, d.arch);
    document.getElementById('dlMeta').textContent = T.dlMeta[state.distro];
    document.getElementById('dlBtnText').textContent = T.dlBtn(d.ext);
    document.getElementById('dlLink').href = d.url;
  }
  render();
})();
