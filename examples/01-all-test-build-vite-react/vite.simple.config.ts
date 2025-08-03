import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import { virtualRouter } from 'vite-plugin-virtual-files/dist/files-router';
import { src2page, jtx_main } from 'vite-plugin-virtual-files/dist/templates';
import fs from 'fs/promises';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    virtualRouter({
      files: [
        { // .js; direct script src
          out: "test/page-name-2.html",
          raw: () => fs.readFile("node_modules/vite-plugin-virtual-files/src/template/withroot.html", { encoding: "utf8" }),
          labels: {
            SCRIPT_SRC: "/test/page-name-2.page.js",
          },
        },
        { // .tsx; using helper and direct src
          out: "test/page-name-3/index.html",
          raw: () => fs.readFile("node_modules/vite-plugin-virtual-files/src/template/minimal.html", { encoding: "utf8" }),
          labels: {
            SCRIPT_SRC: "/test/page-name-3.index.tsx",
          },
        },
        { // .tsx; would be rendered using virtual main; react intermediately
          out: "test/page-name-1.html",
          raw: () => fs.readFile("node_modules/vite-plugin-virtual-files/src/template/minimal.html", { encoding: "utf8" }),
          virtuals: {
            "SCRIPT_SRC": "test/page-name-1.page.tsx.main_react.tsx",
          },
        },
        {
          out: "test/page-name-1.page.tsx.main_react.tsx",
          basedir: "node_modules/vite-plugin-virtual-files/src/template",
          raw: () => fs.readFile("node_modules/vite-plugin-virtual-files/src/template/main_react.tsx", { encoding: "utf8" }),
          isRollupInput: false,
          labels: {
            "SCRIPT_SRC": "/test/page-name-1.page.tsx",
          },
        },

        // ? #######################################################################

        ...src2page({
          index_out: "test/page-name-1.html",
          script_src: "/test/page-name-1.page.tsx",
          main_out: {
            out: "test/page-name-1.page.tsx.main_react.tsx",
            basedir: "node_modules/vite-plugin-virtual-files/src/template",
            raw: jtx_main,
          },
          raw: () => fs.readFile("node_modules/vite-plugin-virtual-files/src/template/withroot.html", { encoding: "utf8" }),
        }),
      ],
    }),
    react(),
  ],

  publicDir: false,
  build: {
    rollupOptions: {},
  }
})
