import { PluginOption, defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { virtualRouter } from './src/vite-virtual-file-router/files-router'
import { showConfig } from './src/plugin/inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // showConfig,
    // DynamicPublicDirectory(["./**"], {
    //    ignore: [...defaultExcluded],
    // }) as unknown as PluginOption,
    showConfig,
    virtualRouter(({ config, env }) => {
      //
    }),
    splitVendorChunkPlugin(),
    react(),
  ],

  build: {
    outDir: "dist",
    assetsDir: "chunks",
  },

  root: process.cwd(),
  publicDir: false,
  base: "/",
});