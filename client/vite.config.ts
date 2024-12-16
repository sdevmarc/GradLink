import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  // build: {
  //   outDir: 'dist', // Default output directory
  //   sourcemap: true, // Ensure sourcemaps are generated
  //   // sourcemap: process.env.NODE_ENV !== 'production', // Disable sourcemaps in production
  // },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   host: "192.168.1.26",  // Allows access from any IP on the local network
  //   port: 3000,       // Customize the port if needed (default is 3000)
  // },
})
