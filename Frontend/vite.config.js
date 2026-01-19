import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Define aliases for cleaner imports
      "@": path.resolve(__dirname, "./src"),
      // Remove explicit path to react-router-dom which may be causing issues
    },
  },
  // Ensure react-router-dom is pre-bundled
  optimizeDeps: {
    include: ["react-router-dom"],
    force: true,
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/], // Include node_modules in commonjs processing
    },
  },
});
