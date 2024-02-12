import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import process from "process";
import Inspect from 'vite-plugin-inspect'
import createInspect from "./src/plugin/inspect";
import htmlTemplate from 'vite-plugin-html-template-mpa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Inspect({
    //   build: true,
    //   outputDir: ".vite-inspect.local",
    // }),
    // createInspect("pre"),
    // createInspect("post"),
    
    htmlTemplate({
      minify: false,
      pages: {
        0: {
          filename: "test/page-name.page.js.html",
          template: "src/template/clean.html",
          inject: {
            data: {
              script_src: "/test/page-name.page.js"
            }
          },
        },
        1: {
          filename: "test/page-name.page.tsx.html",
          template: "src/template/clean.html",
          inject: {
            data: {
              script_src: "/test/page-name.page.tsx"
            }
          },
        },
     },
    }),

    splitVendorChunkPlugin(),
    react(),

    // createInspect("pre"),
    // createInspect("post"),
  ],

  build: {
    rollupOptions: {
      input: ["src/template/blank.html"],
      external: /^(.git|.*\.local|dist|node_modules)$/ig,
    },
    outDir: "dist",
    assetsDir: "chunks",
  },

  root: process.cwd(),
  // publicDir: ".",
  publicDir: false,
  base: "/",

  define: {
    __TIME__: new Date().getTime(),
    "import.meta.env.time": new Date().getTime(),
    VITE_TIME: new Date().getTime(),
  },
});