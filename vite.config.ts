import { defineConfig, PluginOption } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'
import fs from "fs/promises"

const prefix = "\0virtual:";
const files = [
  `${prefix}src/minimal.html`,
  `${prefix}src/main_react.tsx`,
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // tsconfigPaths(),
    [
      {
        name: "virtual",
        resolveId(source, importer, options) {
          console.log("resolveId", source, importer, options);
          if (source.slice(0, prefix.length) != prefix) return;
          console.log("resolveId", "RESOLVED", source, importer, options);
          return source.slice(prefix.length)
        },
        async load(id, options) {
          console.log("load", id, options);
          if (files.indexOf(`${prefix}${id}`) == -1) return;
          console.log("LOADED", id, options);
          let raw = await fs.readFile(id, { encoding: "utf8" });
          return raw;
        },
      } as PluginOption,
    ],
    tsconfigPaths(),
    react(),
  ],
  build: {
    rollupOptions: {
      input: [
        ...files,
        // "src/minimal.html",
      ],
    },
  },
})
