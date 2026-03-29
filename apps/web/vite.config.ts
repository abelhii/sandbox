import { devtools } from "@tanstack/devtools-vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";

const config = defineConfig({
  plugins: [
    nodePolyfills(),
    devtools(),
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],

  server: {
    port: 4000,
    proxy: {
      "/api": {
        target: "http://localhost:4001",
        changeOrigin: true,
      },
      "/ws": {
        target: "ws://localhost:4001",
        ws: true, // ← tells Vite to proxy as WebSocket
      },
    },
  },
});

export default config;
