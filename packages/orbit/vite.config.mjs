import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve("src/index.ts"),
      fileName: "index",
      formats: ["es"],
      name: "orbit",
    },
    minify: false,
    rollupOptions: {
      external: ["thyseus", "@lattice-engine/core", "@lattice-engine/render"],
    },
    target: "esnext",
  },
  plugins: [dts()],
});