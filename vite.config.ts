import { defineConfig } from "vite";
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  resolve: {
    alias: {
      "@vueuse/core": resolve(__dirname, "core/index.ts"),
      "@vueuse/shared": resolve(__dirname, "shared/index.ts"),
    },
  },
  // for example web page
  root: "example",
  plugins: [vue()],
});
