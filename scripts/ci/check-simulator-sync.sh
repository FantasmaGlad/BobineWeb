#!/usr/bin/env bash
# Vérifie que le simulateur d'installation du site reste aligné sur les scripts publiés :
# mêmes titres d'étapes que public/install.sh et public/install-tor.sh, mêmes canaux.
set -euo pipefail
cd "$(dirname "$0")/../.."

python3 - <<'PY'
import re, sys

demo = open("src/components/TerminalDemo.tsx", encoding="utf-8").read()
errors = []

def demo_titles(block_name):
    m = re.search(r"const %s: StepItem\[\] = \[(.*?)\n\];" % block_name, demo, re.S)
    return re.findall(r'labelFr: "((?:[^"\\]|\\.)*)"', m.group(1))

def unescape(t):
    return t.replace('\\"', '"').replace("\\'", "'")

real = re.findall(r'^step\s+[a-z-]+\s+"([^"]+)"', open("public/install.sh", encoding="utf-8").read(), re.M)
sim = [unescape(t) for t in demo_titles("STEPS")]
if real != sim:
    for i in range(max(len(real), len(sim))):
        a = real[i] if i < len(real) else "(absent)"
        b = sim[i] if i < len(sim) else "(absent)"
        if a != b:
            errors.append("install.sh étape %d : script « %s » / simulateur « %s »" % (i + 1, a, b))

tor_real = re.findall(r'^step "\$\(t "([^"]+)"', open("public/install-tor.sh", encoding="utf-8").read(), re.M)
tor_sim = [unescape(t) for t in demo_titles("TOR_STEPS")]
if tor_real != tor_sim:
    errors.append("install-tor.sh : étapes du script %r / simulateur %r" % (tor_real, tor_sim))

channels = set(re.findall(r"--channel=([a-z|]+)", open("public/install.sh", encoding="utf-8").read()))
for name in ("stable", "beta", "canary"):
    if '%s:' % name not in demo.split("CHANNEL_LABEL")[1][:200]:
        errors.append("canal « %s » absent du simulateur" % name)
if "stable|beta|canary" not in channels:
    errors.append("install.sh ne déclare plus --channel=stable|beta|canary : mettre à jour le simulateur")

if errors:
    print("Simulateur d'installation désaligné :", file=sys.stderr)
    for e in errors:
        print("  - " + e, file=sys.stderr)
    sys.exit(1)
print("Simulateur d'installation aligné (%d + %d étapes, 3 canaux)." % (len(sim), len(tor_sim)))
PY
