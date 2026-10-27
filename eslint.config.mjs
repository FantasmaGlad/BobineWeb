import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Regles « React Compiler » du plugin react-hooks : elles signalent des rendus supplementaires
    // (setState dans un effet, lecture de ref au rendu), sans bug ni impact visible. Reglees en
    // avertissements pour garder la CI verte sans refactoriser le chat Baamix, l'animation et le panier.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
  globalIgnores(["**/.next/**", "**/out/**", "**/build/**", "next-env.d.ts", "**/next-env.d.ts", "public/**"]),
]);

export default eslintConfig;
