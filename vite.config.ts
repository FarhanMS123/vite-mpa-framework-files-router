import { PluginOption, defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { virtualRouter } from './src/vite-virtual-router/files-router'
import DynamicPublicDirectory from "./src/vite-multiple-assets"
import { defaultExcluded } from './src/vite-virtual-router/templates'
import { showConfig } from './src/plugin/inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // showConfig,
    DynamicPublicDirectory(["./**"], {
       ignore: [...defaultExcluded],
    }) as unknown as PluginOption,
    showConfig,
    /* virtualRouter({
      scanDir: ".",
      excluded: [...defaultExcluded]
    }), */
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
  publicDir: false,
  base: "/",
});