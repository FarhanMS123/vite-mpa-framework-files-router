import { type PluginOption, defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import Inspect from 'vite-plugin-inspect'
import createInspect from "./src/plugin/inspect";

import process from "process";
import { relative, resolve, join } from "path";
import { existsSync } from "fs";
import shelljs from "shelljs";

import virtualHtml, { Pages } from 'vite-plugin-virtual-html';
import { glob } from 'glob';

// https://vitejs.dev/config/
export default defineConfig(async () => {

  const included = ["**/*.html", "**/*.page.tsx", "**/*.page.ts", "**/*.page.js"];
  const exclude = [".git/**", "*.local/**", "src/**", "dist/**", "node_modules/**"];

  const cache = "";

  // shelljs.mkdir("_");

  
  const pages: Pages = {};

  return {
    plugins: [
      Inspect({
        build: true,
        outputDir: ".vite-inspect.local",
      }),
      // createInspect("pre"),
      // createInspect("post"),
  
      [
        {
          name: "vite-mpa-builtin",
          async config(config, env) {
            const scan = await glob(included, {
              cwd: config.root,
              nodir: true,
              ignore: exclude,
            });
            for(const absolute of scan) {
              const rel = relative(config.root, absolute);
              const key = join(cache, rel);
          
              pages[key.replace(/\\/ig, "/")] = {
                template: "/src/template/clean.html",
                data: {
                  script_src: join("/", rel).replace(/\\/ig, "/"),
                }
              };
            }
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
  };
});