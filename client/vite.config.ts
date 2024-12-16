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
        outDir: "dist", // Optional: Output directory
        sourcemap: true, // Always generate sourcemaps for debugging
        rollupOptions: {
            output: {
                sourcemap: true, // Explicitly set sourcemaps in Rollup config
            },
        },
        commonjsOptions: {
            sourceMap: true, // Ensure sourcemaps are built for CJS dependencies
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
