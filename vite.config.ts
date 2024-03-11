import { type PluginOption, defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'

import process from "process";
import { virtualRouter } from './src/plugin/files-router';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    virtualRouter({
      scanDir: ".",
    }),
    splitVendorChunkPlugin(),
    react(),
  ],

  build: {
    rollupOptions: {
      external: /^(.git|.*\.local|dist|node_modules|\.html)$/ig,
    },
    outDir: "dist",
    assetsDir: "chunks",
  },

  root: process.cwd(),
  publicDir: ".",
  base: "/",
});