import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import { virtualRouter } from 'vite-plugin-virtual-files/dist/files-router';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    virtualRouter({
      files: [
        {
          out: "test/index.html",
          raw: () => fs.readFileSync("node_modules/vite-plugin-virtual-files/src/template/minimal.html")
                        .toString('utf-8').replace("%SCRIPT_SRC%", "/test/index.page.js")
        },
      ],
    }),
    react()
  ],

  publicDir: false,
  build: {
    rollupOptions: {},
  }
})
