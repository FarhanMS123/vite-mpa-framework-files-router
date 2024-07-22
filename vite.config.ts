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
    [
      {
        name: "virtual",
        resolveId(source, importer, options) {
          return source.slice(0, prefix.length) == prefix ? source.slice(prefix.length) : source;
        },
        async load(id, options) {
          if (files.indexOf(`${prefix}${id}`) == -1) return;
          let raw = await fs.readFile(id);
          return raw;
        },
      } as PluginOption,
    ],
    tsconfigPaths(),
    react(),
  ],
  build: {
    rollupOptions: {
      input: files,
    },
  },
})
