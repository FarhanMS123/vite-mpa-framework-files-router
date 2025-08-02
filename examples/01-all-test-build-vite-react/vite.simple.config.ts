import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import { virtualRouter } from 'vite-plugin-virtual-files/dist/files-router';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    virtualRouter({
      files: [
        { // .js; direct script src
          out: "test/page-name-2.html",
          raw: () => fs.readFileSync("node_modules/vite-plugin-virtual-files/src/template/withroot.html").toString('utf-8'),
          labels: {
            SCRIPT_SRC: "/test/page-name-2.page.js",
          },
        },
        { // .tsx; using helper and direct src
          out: "test/page-name-3/index.html",
          raw: () => fs.readFileSync("node_modules/vite-plugin-virtual-files/src/template/minimal.html")
                        .toString('utf-8'),
          labels: {
            SCRIPT_SRC: "/test/page-name-3.index.tsx",
          },
        },
        { // .tsx; would be rendered using virtual main; react intermediately
          out: "test/page-name-1.html",
          raw: () => fs.readFileSync("node_modules/vite-plugin-virtual-files/src/template/minimal.html").toString('utf-8'),
          virtuals: {
            "SCRIPT_SRC": "test/page-name-1.page.tsx.main_react.tsx"
          },
        },
        {
          out: "test/page-name-1.page.tsx.main_react.tsx",
          raw: () => fs.readFileSync("node_modules/vite-plugin-virtual-files/src/template/main_react.tsx").toString('utf-8'),
          isRollupInput: false,
          labels: {
            "SCRIPT_SRC": "/test/page-name-1.page.tsx"
          },
        },
      ],
    }),
    react(),
  ],

  publicDir: false,
  build: {
    rollupOptions: {},
  }
})
