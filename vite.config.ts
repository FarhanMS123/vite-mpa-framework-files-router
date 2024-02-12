import { type PluginOption, defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import process from "process";
import Inspect from 'vite-plugin-inspect'
import createInspect from "./src/plugin/inspect";

import { createHtmlPlugin } from 'vite-plugin-html'
import htmlTemplateMPA from 'vite-plugin-html-template-mpa';
import htmlTemplate from 'vite-plugin-html-template';
import virtualHtml from 'vite-plugin-virtual-html';

import mpaPlugin from 'vite-plugin-mpa-plus'
import simpleHtmlPlugin from 'vite-plugin-simple-html';
import mpa from 'vite-plugin-multi-pages';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Inspect({
    //   build: true,
    //   outputDir: ".vite-inspect.local",
    // }),
    // createInspect("pre"),
    // createInspect("post"),

    htmlTemplateMPA({
      minify: false,
      pagesDir: process.cwd(),
      pages: {
        "page1": {
          filename: "test/page-name.page.js.html",
          template: "src/template/clean.html",
          inject: {
            data: {
              script_src: "/test/page-name.page.js",
            },
          },
        },
      },
    }),
    
    // ! NOT WORKING
    // htmlTemplate.default({
    //   pagesDir: ".",
    //   pages: {
    //     page1: {
    //       filename: "test/page-name.page.js.html",
    //       template: "src/template/clean.html",
    //       title: "/test/page-name.page.js",
    //     },
    //   },
    // }),

    splitVendorChunkPlugin(),
    react(),

    // createInspect("pre"),
    // createInspect("post"),
  ],

  build: {
    rollupOptions: {
      input: {
        "page1": "src/template/clean.html",
      },
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