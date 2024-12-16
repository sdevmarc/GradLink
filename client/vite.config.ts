import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// Custom plugin to normalize import case
function normalizeImports() {
    return {
      name: "vite:normalize-imports",
      resolveId(source) {
        return source.toLowerCase(); // Normalize to lowercase
      },
    };
  }

export default defineConfig({
    plugins: [react(), normalizeImports()],
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },
    build: {
        sourcemap: process.env.NODE_ENV !== "production", // Enable sourcemaps only in development
      },
      
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
