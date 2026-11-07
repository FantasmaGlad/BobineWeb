#!/usr/bin/env python3
"""Signature du miroir statique du site : fabrication du manifeste (CI) et vérification (machine hôte).

Le manifeste `SHA256SUMS` liste chaque fichier de la branche `onion-site` ; sa signature détachée `SHA256SUMS.asc` est
faite en CI avec une clé dédiée. La machine hôte ne fait confiance qu'à l'empreinte qu'elle a elle-même installée : une
branche modifiée sans cette clé, un fichier ajouté, retiré ou altéré, ou un retour à une ancienne version sont refusés.

  site-signature.py manifest DOSSIER
  site-signature.py verify DOSSIER --key CLE_PUBLIQUE.asc --fingerprint EMPREINTE [--previous-built HORODATAGE]
"""
import argparse
import hashlib
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

MANIFEST = 'SHA256SUMS'
SIGNATURE = 'SHA256SUMS.asc'
BUILT = re.compile(r'^built: (\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ)$', re.M)
SOURCE = re.compile(r'^source: \S+@[0-9a-f]{40}$', re.M)
BAD_STATUS = ('BADSIG', 'ERRSIG', 'EXPSIG', 'EXPKEYSIG', 'REVKEYSIG', 'NO_PUBKEY')


def files(root):
    found = {}
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root).as_posix()
        if path.is_symlink():
            raise ValueError(f'lien symbolique interdit : {relative}')
        if path.is_file() and relative not in (MANIFEST, SIGNATURE):
            found[relative] = path
        elif not path.is_dir() and not path.is_file():
            raise ValueError(f'fichier spécial interdit : {relative}')
    return found


def digest(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def manifest(root):
    root = root.resolve()
    lines = [f'{digest(path)}  {relative}' for relative, path in files(root).items()]
    (root / MANIFEST).write_text('\n'.join(lines) + '\n', encoding='utf-8')


def parse(text):
    entries = {}
    for line in text.splitlines():
        match = re.fullmatch(r'([0-9a-f]{64})  (\S.*)', line)
        if not match:
            raise ValueError(f'ligne de manifeste illisible : {line!r}')
        name = match.group(2)
        if name.startswith('/') or '..' in name.split('/') or name in entries:
            raise ValueError(f'chemin de manifeste interdit : {name!r}')
        entries[name] = match.group(1)
    return entries


def check_signature(root, key, fingerprint):
    with tempfile.TemporaryDirectory() as home:
        os.chmod(home, 0o700)
        env = {**os.environ, 'GNUPGHOME': home}
        subprocess.run(['gpg', '--batch', '--quiet', '--import', str(key)], env=env, check=True, capture_output=True)
        result = subprocess.run(['gpg', '--batch', '--status-fd', '1', '--verify', str(root / SIGNATURE), str(root / MANIFEST)],
                                env=env, capture_output=True, text=True)
    status = [line.split() for line in result.stdout.splitlines() if line.startswith('[GNUPG:] ')]
    if result.returncode != 0 or any(fields[1] in BAD_STATUS for fields in status):
        raise ValueError('signature du manifeste invalide')
    valid = [fields for fields in status if fields[1] == 'VALIDSIG']
    expected = fingerprint.replace(' ', '').upper()
    # VALIDSIG <empreinte de la sous-clé> ... <empreinte de la clé principale> : l'une ou l'autre peut être celle épinglée.
    if len(valid) != 1 or expected not in (valid[0][2].upper(), valid[0][-1].upper()):
        raise ValueError('le manifeste n\'est pas signé par la clé attendue')


def verify(root, key, fingerprint, previous_built=None):
    root = root.resolve()
    for name in (MANIFEST, SIGNATURE):
        if not (root / name).is_file():
            raise ValueError(f'{name} absent : branche non signée')
    check_signature(root, key, fingerprint)
    entries = parse((root / MANIFEST).read_text(encoding='utf-8'))
    present = files(root)
    if set(entries) != set(present):
        extra, missing = sorted(set(present) - set(entries)), sorted(set(entries) - set(present))
        raise ValueError(f'fichiers hors manifeste : {extra[:3]} ; absents : {missing[:3]}')
    for name, expected in entries.items():
        if digest(present[name]) != expected:
            raise ValueError(f'empreinte incorrecte : {name}')
    info = present.get('mirror-info.txt')
    text = info.read_text(encoding='utf-8') if info else ''
    built = BUILT.search(text)
    if not built or not SOURCE.search(text):
        raise ValueError('mirror-info.txt sans source ni horodatage valides')
    if previous_built and built.group(1) < previous_built:
        raise ValueError(f'version plus ancienne que celle servie ({built.group(1)} < {previous_built})')
    return built.group(1)


def main(argv):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest='command', required=True)
    sub.add_parser('manifest').add_argument('directory', type=Path)
    check = sub.add_parser('verify')
    check.add_argument('directory', type=Path)
    check.add_argument('--key', type=Path, required=True)
    check.add_argument('--fingerprint', required=True)
    check.add_argument('--previous-built')
    args = parser.parse_args(argv)
    try:
        if args.command == 'manifest':
            manifest(args.directory)
        else:
            print(verify(args.directory, args.key, args.fingerprint, args.previous_built))
    except (ValueError, subprocess.CalledProcessError) as error:
        print(f'site-signature : {error}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
