#!/usr/bin/env python3
"""Adapte le portail local aux dépôts onion sans requête vers le web classique."""
import json
import re
import sys
from pathlib import Path

root = Path(sys.argv[1])
packages_host = 'rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion'
site_host = 'bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion'
for page in root.rglob('*.html'):
    html = page.read_text()
    html = html.replace('https://packages.bobine.fit', f'http://{packages_host}')
    html = html.replace('https://bobine.fit', f'http://{site_host}')
    html = re.sub(r'href="https://(?:github.com|security.bobine.fit)[^"]*"', f'href="http://{site_host}/fr/"', html)
    # La documentation sémantique schema.org ne charge aucune ressource réseau.
    html = html.replace("fetch('https://api.github.com/repos/FantasmaGlad/Bobine/releases/latest')", "Promise.reject(new Error('onion: local metadata only'))")
    if 'function getCommands() {' in html:
        lang = 'fr' if page.relative_to(root).parts[0] == 'fr' else 'en'
        command = f"curl --fail --socks5-hostname 127.0.0.1:9050 http://{site_host}/install-tor.sh -o install-tor.sh\\nless install-tor.sh\\nbash install-tor.sh --lang={lang} --channel="
        html = html.replace('function getCommands() {', 'function getCommands() {\n      return [{comment: "Tor · APT / DNF / Pacman", cmd: ' + json.dumps(command.replace('\\n','\n')) + ' + STATE.channel}];\n')
        # Les liens directs pointent vers les index locaux signés et leur liste
        # de fichiers, afin de ne pas déduire un nom de paquet à partir d'une version.
        html = html.replace('function getDirectDownloadInfo() {', '''function getDirectDownloadInfo() {
      const family = STATE.distro === 'debian' ? 'debian' : STATE.distro === 'fedora' ? 'fedora' : 'arch';
      return {title: 'Tor · ' + family, meta: 'APT / DNF / Pacman', btn: 'Index', url: '/' + family + '/' + (family === 'debian' ? '' : STATE.channel + '/')};
''')
    page.write_text(html)
for repo in (root / 'fedora').glob('*.repo'):
    text = repo.read_text().replace('https://packages.bobine.fit', f'http://{packages_host}')
    repo.write_text(text + '\nproxy=socks5h://127.0.0.1:9050\n')
print('[packages-tor] portail et configurations locaux')
