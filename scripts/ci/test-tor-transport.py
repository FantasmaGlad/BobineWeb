#!/usr/bin/env python3
"""Vérifie curl contre un proxy SOCKS local : erreur 97 transitoire ou persistante."""
from pathlib import Path
import re
import socket
import subprocess
import threading
import unittest

SCRIPT = Path(__file__).with_name('smoke-onion.sh')


def receive(connection, size):
    data = b''
    while len(data) < size:
        chunk = connection.recv(size-len(data))
        if not chunk:
            raise ConnectionError('connexion interrompue')
        data += chunk
    return data


class TransportTest(unittest.TestCase):
    def check_proxy(self, fail_count):
        attempts = []
        errors = []
        with socket.socket() as server:
            server.bind(('127.0.0.1', 0))
            server.listen()
            server.settimeout(15)
            port = server.getsockname()[1]

            def serve():
                try:
                    for index in range(min(fail_count+1, 3)):
                        connection, _ = server.accept()
                        with connection:
                            connection.settimeout(5)
                            version, methods = receive(connection, 2)
                            assert version == 5
                            receive(connection, methods)
                            connection.sendall(b'\x05\x00')
                            header = receive(connection, 4)
                            assert header == b'\x05\x01\x00\x03'
                            host = receive(connection, receive(connection, 1)[0])
                            receive(connection, 2)
                            assert host == b'fixture.invalid'
                            attempts.append(index)
                            if index < fail_count:
                                connection.sendall(b'\x05\x04\x00\x01\x00\x00\x00\x00\x00\x00')
                            else:
                                connection.sendall(b'\x05\x00\x00\x01\x7f\x00\x00\x01\x00\x50')
                                request = b''
                                while b'\r\n\r\n' not in request:
                                    request += connection.recv(4096)
                                connection.sendall(b'HTTP/1.1 200 OK\r\nContent-Length: 7\r\nConnection: close\r\n\r\nfixture')
                except Exception as error:
                    errors.append(error)

            thread = threading.Thread(target=serve, daemon=True)
            thread.start()
            function = re.search(r'^curlt\(\) \{.*\}$', SCRIPT.read_text(), re.M).group()
            # Seul le port est adapté pour isoler le test du Tor installé sur la machine.
            function = function.replace('127.0.0.1:9050', f'127.0.0.1:{port}')
            result = subprocess.run(['bash', '-c', 'set -e\n'+function+'\ncurlt http://fixture.invalid/probe'], capture_output=True, text=True, timeout=25)
            thread.join(timeout=1)
            self.assertFalse(errors, errors)
            self.assertEqual(len(attempts), min(fail_count+1, 3))
            return result

    def test_recovers_from_socks_host_unreachable(self):
        result = self.check_proxy(1)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout, 'fixture')

    def test_persistent_failure_remains_an_error(self):
        result = self.check_proxy(3)
        self.assertEqual(result.returncode, 97, result.stderr)
        self.assertNotIn('fixture', result.stdout)


if __name__ == '__main__':
    unittest.main()
