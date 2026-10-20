import { defineConfig } from "eslint/config";
import next from "eslint-config-next";

export default defineConfig([
  {
    ignores: [".next*/**", ".verification/**", "node_modules/**", "dist/**", "build/**"],
  },
  ...next,
]);
