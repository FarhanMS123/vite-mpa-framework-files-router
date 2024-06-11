import { type PluginOption, defineConfig, splitVendorChunkPlugin, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { relative } from "path";
import { inspect } from "util";

let a = true;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      // input: {
      //   // "namamama": "src/index.html",
      //   // main: "src/other.html",
      //   // "simp/megamendung.tsx": "index.html",
      //   // "simp/megamendung": "src/other.html",
      //   // "chunks/main": "src/main.tsx",
      //   "some/app.tsx": "/src/App.tsx.html",
      // },
      input: ["src/App.tsx"],
    },
  },
  // [1734, 2199, 3194, 3682]
  plugins: [
    /**
     * Without virtualling this is works. So why I need that ducking \0 and virtualization. What did I solve at beginning.
     * I really forger.
     */
    {
      name: "something",
      resolveId(source, importer, options) {
        console.log("resolveId", [source, importer, options]);
        return "Ga.tsx";
      },
      load(id, options) {
        console.log("load", [id, options]);
        return `console.log("hehe")`;
      },
    },
    splitVendorChunkPlugin(),
    react(),
  ],
});