import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import process from "process";
import Inspect from 'vite-plugin-inspect'
import createInspect from "./src/plugin/inspect";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspect({
      build: true,
      outputDir: ".vite-inspect.local",
    }),
    react(),
  ],

  build: {
    rollupOptions: {
      // input: {},
      // output: [], // { name, entryFileNames }
      external: /^(.git|.cache.local|dist|node_modules)$/ig,
    },
    outDir: "dist",
    assetsDir: "chunks",
  },

  root: process.cwd(),
  publicDir: ".",
  base: "/",

  define: {
    __TIME__: new Date().getTime(),
    "import.meta.env.time": new Date().getTime(),
    VITE_TIME: new Date().getTime(),
  },
})
