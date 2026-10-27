import type { SecurityStrings } from "../content/security-content";

interface DisclosurePolicyProps {
  strings: SecurityStrings;
}

export default function DisclosurePolicy({ strings }: DisclosurePolicyProps) {
  const isFr = strings.lang === "fr";

  return (
    <>
      {/* Spécifications de la clé */}
      <section className="specs-section" aria-labelledby="specs-heading">
        <h2 id="specs-heading" className="specs-section__title">
          {strings.specsTitle}
        </h2>

        <table className="specs-table">
          <tbody>
            <tr>
              <th scope="row">{isFr ? "Identité" : "Identity"}</th>
              <td>Bobine Security &lt;security@bobine.fit&gt;</td>
            </tr>
            <tr>
              <th scope="row">{isFr ? "Empreinte" : "Fingerprint"}</th>
              <td>23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2</td>
            </tr>
            <tr>
              <th scope="row">{isFr ? "Algorithmes" : "Algorithms"}</th>
              <td>Ed25519 (certify, sign) · Curve25519 (encrypt)</td>
            </tr>
            <tr>
              <th scope="row">{isFr ? "Expiration" : "Expiration"}</th>
              <td>2028-10-06</td>
            </tr>
            <tr>
              <th scope="row">{isFr ? "Clé publique brute" : "Raw public key"}</th>
              <td>
                <a href="/security.asc" download="security.asc">
                  security.asc
                </a>
              </td>
            </tr>
            <tr>
              <th scope="row">security.txt ({isFr ? "signé" : "signed"})</th>
              <td>
                <a href="/.well-known/security.txt">/.well-known/security.txt</a>
              </td>
            </tr>
            <tr>
              <th scope="row">DNS</th>
              <td>TXT <code>openpgp4fpr</code> sur bobine.fit · enregistrement OPENPGPKEY (RFC 7929)</td>
            </tr>
            <tr>
              <th scope="row">{isFr ? "Politique" : "Policy"}</th>
              <td>
                <a href={isFr ? "/fr/" : "/"}>
                  {isFr ? "security.bobine.fit/fr/" : "security.bobine.fit"}
                </a>{" "}
                ·{" "}
                <a
                  href="https://github.com/FantasmaGlad/Bobine/blob/main/SECURITY.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SECURITY.md
                </a>
              </td>
            </tr>
            <tr>
              <th scope="row">{isFr ? "Signalement privé" : "Private report"}</th>
              <td>
                <a
                  href="https://github.com/FantasmaGlad/Bobine/security/advisories/new"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Security Advisory
                </a>
              </td>
            </tr>
            <tr>
              <th scope="row">{isFr ? "Clé révoquée" : "Revoked key"}</th>
              <td>
                <a
                  href="https://github.com/FantasmaGlad/Bobine/blob/main/docs/security/revoked/bobine-security-8208FFD3F7AB4DD3-REVOKED.asc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  8208 FFD3 F7AB 4DD3 ({isFr ? "révoquée le 2026-10-07" : "revoked on 2026-10-07"})
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Historique des bulletins et avis de sécurité */}
      <section className="specs-section" aria-labelledby="bulletins-heading">
        <h2 id="bulletins-heading" className="specs-section__title">
          {strings.bulletinsTitle}
        </h2>

        <table className="specs-table">
          <tbody>
            <tr>
              <th scope="row">2026-10-08</th>
              <td>
                {isFr
                  ? "Publication du portail security.bobine.fit et enregistrement DNS openpgp4fpr · Vérification CI quotidienne active."
                  : "Launch of security.bobine.fit and openpgp4fpr DNS publication · Daily CI audit active."}
              </td>
            </tr>
            <tr>
              <th scope="row">2026-10-07</th>
              <td>
                {isFr
                  ? "Mise en service de la clé officielle de signalement 23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2 · Signature RFC 9116."
                  : "Activation of official reporting key 23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2 · RFC 9116 signing."}
              </td>
            </tr>
            <tr>
              <th scope="row">2026-10-07</th>
              <td>
                {isFr
                  ? "Révocation préventive de la clé 8208FFD3 suite à un problème de phrase de passe (clé privée non compromise, aucun rapport reçu)."
                  : "Precautionary revocation of key 8208FFD3 due to passphrase issue (private key uncompromised, zero reports received)."}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
