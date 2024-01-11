import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import process from "process";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      input: {
        "page-name.tsx.js": "src/page-name.tsx",
      },
      external: /^(.git|dist|node_modules)$/ig
    },
    outDir: "dist",
    assetsDir: "chunks",
  },

  root: process.cwd(),
  publicDir: "src",
  base: "/",

  define: {
    __TIME__: new Date().getTime(),
    "import.meta.env.time": new Date().getTime(),
    VITE_TIME: new Date().getTime(),
  },
})
