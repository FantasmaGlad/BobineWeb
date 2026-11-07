#!/usr/bin/env python3
"""Refus d'un miroir de site non signé, altéré, incomplet, signé par une autre clé ou plus ancien que celui servi."""
import importlib.util
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('signature', Path(__file__).with_name('site-signature.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def make_key(home, name):
    os.chmod(home, 0o700)
    env = {**os.environ, 'GNUPGHOME': str(home)}
    subprocess.run(['gpg', '--batch', '--pinentry-mode', 'loopback', '--passphrase', '', '--quick-generate-key', f'{name} <{name}@test.invalid>', 'ed25519', 'sign', 'never'],
                   env=env, check=True, capture_output=True)
    listing = subprocess.run(['gpg', '--batch', '--with-colons', '--fingerprint', '--list-secret-keys'], env=env,
                             check=True, capture_output=True, text=True).stdout
    fingerprint = next(line.split(':')[9] for line in listing.splitlines() if line.startswith('fpr:'))
    public = Path(str(home) + '.pub.asc')
    public.write_text(subprocess.run(['gpg', '--batch', '--armor', '--export', fingerprint], env=env, check=True,
                                     capture_output=True, text=True).stdout)
    return env, fingerprint, public


def build(root, env, built='2026-11-07T04:17:00Z'):
    (root / 'fr').mkdir(parents=True)
    (root / 'fr/index.html').write_text('<html>fr</html>')
    (root / 'mirror-info.txt').write_text(f'source: FantasmaGlad/BobineWeb@{"a" * 40}\nbuilt: {built}\n')
    module.manifest(root)
    subprocess.run(['gpg', '--batch', '--pinentry-mode', 'loopback', '--passphrase', '', '--armor', '--detach-sign', '-o', str(root / module.SIGNATURE), str(root / module.MANIFEST)],
                   env=env, check=True, capture_output=True)


def refused(label, root, key, fingerprint, previous=None):
    try:
        module.verify(root, key, fingerprint, previous)
    except ValueError:
        return
    raise SystemExit(f'accepté à tort : {label}')


with tempfile.TemporaryDirectory() as temporary:
    base = Path(temporary)
    good_home, other_home = base / 'good', base / 'other'
    good_home.mkdir(); other_home.mkdir()
    env, fingerprint, public = make_key(good_home, 'miroir')
    other_env, other_fingerprint, other_public = make_key(other_home, 'intrus')

    site = base / 'site'
    build(site, env)
    assert module.verify(site, public, fingerprint) == '2026-11-07T04:17:00Z'
    assert module.verify(site, public, fingerprint, '2026-11-06T04:17:00Z')

    def copy(name):
        target = base / name
        shutil.copytree(site, target)
        return target

    tampered = copy('tampered'); (tampered / 'fr/index.html').write_text('<html>piraté</html>')
    refused('fichier altéré', tampered, public, fingerprint)
    extra = copy('extra'); (extra / 'fr/script.js').write_text('alert(1)')
    refused('fichier ajouté', extra, public, fingerprint)
    missing = copy('missing'); (missing / 'fr/index.html').unlink()
    refused('fichier retiré', missing, public, fingerprint)
    unsigned = copy('unsigned'); (unsigned / module.SIGNATURE).unlink()
    refused('sans signature', unsigned, public, fingerprint)
    edited = copy('edited'); (edited / module.MANIFEST).write_text((edited / module.MANIFEST).read_text() + '0' * 64 + '  fr/x\n')
    refused('manifeste modifié', edited, public, fingerprint)
    link = copy('link'); (link / 'fr/lien').symlink_to('/etc/passwd')
    refused('lien symbolique', link, public, fingerprint)

    intruder = base / 'intruder'
    build(intruder, other_env)
    refused('autre clé', intruder, other_public, fingerprint)
    refused('autre clé, empreinte de l\'intrus épinglée à la mauvaise clé', intruder, public, other_fingerprint)
    refused('retour en arrière', site, public, fingerprint, '2026-11-08T00:00:00Z')

    bad_info = base / 'bad_info'
    build(bad_info, env, built='hier')
    refused('horodatage illisible', bad_info, public, fingerprint)
print('site-signature : tous les refus attendus sont observés')
