import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { swConfig } from "./vite-config/sw-config";

export default defineConfig({
  plugins: [VitePWA(swConfig)],
  build: {
    target: "es2022",
  },
  esbuild: {
    target: "es2022",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022",
    },
  },
});
