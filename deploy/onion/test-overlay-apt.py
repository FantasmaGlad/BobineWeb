#!/usr/bin/env python3
"""Les overlays du miroir onion ne laissent aucune commande ni aucun lien vers le web classique."""
import importlib.util
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
OVERLAY = HERE / "overlay" / "apt"
sys.dont_write_bytecode = True


def load(name):
    spec = importlib.util.spec_from_file_location(name.replace("-", "_"), OVERLAY / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def run(script, folder):
    return subprocess.run([sys.executable, str(OVERLAY / script), str(folder)], capture_output=True, text=True)


PAGE = ('<a href="https://packages.bobine.fit/bobine.gpg">clé</a>\n<!-- install -->\n<pre><code>curl -fsSL https://packages.bobine.fit/bobine.gpg'
        '</code></pre>\n<!-- /install -->\n<a href="https://github.com/FantasmaGlad/Bobine">GitHub</a>')


def portal(root: Path) -> Path:
    (root / "assets").mkdir(parents=True)
    (root / "fr").mkdir()
    (root / "index.html").write_text(PAGE, encoding="utf-8")
    (root / "fr" / "index.html").write_text(PAGE, encoding="utf-8")
    (root / "README.md").write_text("curl -fsSL https://packages.bobine.fit/bobine.gpg", encoding="utf-8")
    (root / "llms.txt").write_text("https://bobine.fit/", encoding="utf-8")
    (root / ".well-known").mkdir()
    (root / ".well-known" / "security.txt").write_text("Contact: https://security.bobine.fit/", encoding="utf-8")
    (root / "bobine-stable.repo").write_text("[b]\nbaseurl=https://packages.bobine.fit/fedora/\n", encoding="utf-8")
    (root / "assets" / "NOTICE.md").write_text("Source : https://github.com/FantasmaGlad/BobineWeb", encoding="utf-8")
    return root


class OverlayTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = portal(Path(self.tmp.name) / "release")
        self.addCleanup(self.tmp.cleanup)

    def test_the_unadapted_portal_is_refused(self):
        check = run("no-clearnet-check.py", self.root)
        self.assertEqual(check.returncode, 1)
        self.assertIn("packages.bobine.fit", check.stderr)

    def test_the_adapted_portal_has_no_clearnet_left(self):
        for script in ("packages-tor.py", "site-tor.py", "mirror-files-tor.py"):
            self.assertEqual(run(script, self.root).returncode, 0, script)
        check = run("no-clearnet-check.py", self.root)
        self.assertEqual(check.returncode, 0, check.stderr)
        for name, title in (("index.html", "Install over Tor"), ("fr/index.html", "Installer par Tor")):
            page = (self.root / name).read_text(encoding="utf-8")
            self.assertIn(title, page)
            self.assertIn("--socks5-hostname 127.0.0.1:9050", page)
            self.assertIn("install-tor.sh", page)
            self.assertNotIn("github.com", page)
        for name in ("README.md", "llms.txt", ".well-known/security.txt"):
            self.assertFalse((self.root / name).exists(), name)
        repo = (self.root / "bobine-stable.repo").read_text(encoding="utf-8")
        self.assertIn("http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/fedora/", repo)
        self.assertIn("proxy=socks5h://127.0.0.1:9050", repo)
        self.assertNotIn("https://", (self.root / "assets" / "NOTICE.md").read_text(encoding="utf-8"))

    def test_a_page_without_the_install_block_fails_the_overlay(self):
        (self.root / "fr" / "index.html").write_text("<p>sans bloc</p>", encoding="utf-8")
        result = run("site-tor.py", self.root)
        self.assertEqual(result.returncode, 1)
        self.assertIn("marqueurs", result.stderr)

    def test_svg_attributions_are_not_links(self):
        (self.root / "logo.svg").write_text("<svg><dc:source>https://github.com/garrett/Tux</dc:source></svg>", encoding="utf-8")
        for script in ("packages-tor.py", "site-tor.py", "mirror-files-tor.py"):
            run(script, self.root)
        self.assertEqual(run("no-clearnet-check.py", self.root).returncode, 0)


class SiteOverlayTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)
        site = Path(__file__).resolve().parent / "overlay" / "site"
        self.run_site = lambda script: subprocess.run([sys.executable, str(site / script), str(self.root)], capture_output=True, text=True)

    def write(self, name, text):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return path

    def test_install_commands_become_tor_commands(self):
        page = self.write("fr/index.html", "curl -fsSL https://bobine.fit/install.sh | sudo bash\n"
                          "curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta\n"
                          "curl -fsSL https://github.com/FantasmaGlad/Bobine/releases/download/canary/install.sh | bash -s -- --channel=canary\n"
                          "curl -sSL https://bobine.fit/install-tor.sh | bash")
        self.assertEqual(self.run_site("check-commands.py").returncode, 1)
        self.assertEqual(self.run_site("commands-tor.py").returncode, 0)
        self.assertEqual(self.run_site("check-commands.py").returncode, 0)
        text = page.read_text(encoding="utf-8")
        self.assertEqual(text.count("curl --socks5-hostname 127.0.0.1:9050 -fsSL http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/install-tor.sh"), 4)
        self.assertIn("| bash -s -- --channel=beta", text)
        self.assertIn("| bash -s -- --channel=canary", text)
        self.assertNotIn("sudo bash", text)

    def test_the_tor_installer_download_goes_through_tor(self):
        page = self.write("fr/documentation/anonymisation/index.html", "curl -fsSL https://bobine.fit/install-tor.sh -o install-tor.sh\nless install-tor.sh\nbash install-tor.sh")
        self.assertEqual(self.run_site("commands-tor.py").returncode, 0)
        self.assertEqual(self.run_site("check-commands.py").returncode, 0)
        self.assertIn("curl --socks5-hostname 127.0.0.1:9050 -fsSL http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/install-tor.sh -o install-tor.sh", page.read_text(encoding="utf-8"))

    def test_repository_commands_use_the_package_onion_service(self):
        page = self.write("docs.js", "curl -fsSL https://packages.bobine.fit/bobine.gpg | sudo gpg --dearmor\n"
                          "deb [signed-by=/etc/apt/keyrings/bobine.gpg] https://packages.bobine.fit/debian stable main")
        self.run_site("commands-tor.py")
        text = page.read_text(encoding="utf-8")
        self.assertIn("curl --socks5-hostname 127.0.0.1:9050 -fsSL http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/bobine.gpg", text)
        self.assertIn("http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/debian stable main", text)
        self.assertEqual(self.run_site("check-commands.py").returncode, 0)

    def test_read_before_running_keeps_its_three_lines_consistent(self):
        page = self.write("a.js", "curl -fsSL https://bobine.fit/install.sh -o install.sh\nless install.sh\nsudo bash install.sh --channel=beta")
        self.run_site("commands-tor.py")
        lines = page.read_text(encoding="utf-8").splitlines()
        self.assertTrue(lines[0].endswith("install-tor.sh -o install-tor.sh"))
        self.assertEqual(lines[1:], ["less install-tor.sh", "bash install-tor.sh --channel=beta"])

    def test_plain_links_are_allowed_but_unknown_curl_commands_are_refused(self):
        self.write("a.html", '<a href="https://github.com/FantasmaGlad/Bobine">code</a>')
        self.assertEqual(self.run_site("check-commands.py").returncode, 0)
        self.write("b.html", "curl --proto '=https' https://raw.githubusercontent.com/x/y/z.sh | sh")
        result = self.run_site("check-commands.py")
        self.assertEqual(result.returncode, 1)
        self.assertIn("raw.githubusercontent.com", result.stderr)


if __name__ == "__main__":
    unittest.main()
