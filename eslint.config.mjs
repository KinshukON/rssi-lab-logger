import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "next-env.d.ts",
    "electron/**", // Node/CommonJS; use require. Lint Next app only.
  ]),
  {
    rules: {
      // Electron bridge: (window as any).electronAPI is standard.
      "@typescript-eslint/no-explicit-any": "warn",
      // setState in effect: common for hydration; relax for now.
      "react-hooks/set-state-in-effect": "warn",
      // External avatars (OAuth): next/image may not work; img acceptable.
      "@next/next/no-img-element": "warn",
    },
  },
]);

export default eslintConfig;
