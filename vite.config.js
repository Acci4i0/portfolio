import { defineConfig } from "vite";
import { resolve } from "node:path";

// Multipage: home (replica krisludi) + projects (replica malikkotb.com/work)
// base relativa: il sito è pubblicato come GitHub Pages di progetto in un
// sottopercorso (https://acci4i0.github.io/portfolio/) e con "./" i percorsi
// funzionano identici in dev, in preview e su Pages.
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        projects: resolve(import.meta.dirname, "projects.html"),
      },
    },
  },
});
