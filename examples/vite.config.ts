import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        basic: resolve(__dirname, "basic/index.html"),
        gltf: resolve(__dirname, "gltf/index.html"),
        main: resolve(__dirname, "index.html"),
      },
    },
    target: "esnext",
  },
});
