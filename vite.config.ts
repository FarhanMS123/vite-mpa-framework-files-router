import { type PluginOption, defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import Inspect from 'vite-plugin-inspect'
import createInspect from "./src/plugin/inspect";

import process from "process";
import { virtualRouter } from './src/plugin/files-router';
import { inspect } from "util";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspect({
      build: true,
      outputDir: ".vite-inspect.local",
    }),
    // createInspect("pre"),
    // createInspect("post"),
    
    virtualRouter(),
    [
      {
        name: "vite-showing-config",
        config(config, env) {
          delete config.plugins;
          // console.log(inspect(config, true, Infinity));
          // process.exit();
        },
      }
    ],
    splitVendorChunkPlugin(),
    react(),

    // createInspect("pre"),
    // createInspect("post"),
  ],

  build: {
    rollupOptions: {
      external: /^(.git|.*\.local|dist|node_modules)$/ig,
    },
    outDir: "dist",
    assetsDir: "chunks",
  },

  root: process.cwd(),
  publicDir: false,
  base: "/",

  define: {
    __TIME__: new Date().getTime(),
    "import.meta.env.time": new Date().getTime(),
    VITE_TIME: new Date().getTime(),
  },
});