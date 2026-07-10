import { defineConfig } from "vite";
import { resolve } from "node:path";

// Multipage: home (replica krisludi) + projects (replica malikkotb.com/work)
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        projects: resolve(import.meta.dirname, "projects.html"),
      },
    },
  },
});
