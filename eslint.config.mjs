import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  { ignores: [".next/**", "node_modules/**"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Los eyebrows "// 01 — ..." son texto visible a propósito.
  { rules: { "react/jsx-no-comment-textnodes": "off" } },
];
