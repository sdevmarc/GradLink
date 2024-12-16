import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
    plugins: [
        react()
    ],
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
