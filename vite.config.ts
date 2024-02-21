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

  const root = process.cwd();
  const outDir = "dist";
  const cache = "";

  // shelljs.mkdir("_");

  const scan = await glob(included, {
    cwd: root,
    nodir: true,
    ignore: exclude,
  });
  const pages: Pages = {};

  for(const absolute of scan) {
    const rel = relative(root, absolute);
    const key = join(cache, rel);

    pages[key.replace(/\\/ig, "/")] = {
      template: "/src/template/clean.html",
      data: {
        script_src: join("/", rel).replace(/\\/ig, "/"),
      }
    };
  }

  console.log(pages);

  return {
    plugins: [
      Inspect({
        build: true,
        outputDir: ".vite-inspect.local",
      }),
      // createInspect("pre"),
      // createInspect("post"),
  
      virtualHtml({
        pages,
      }) as unknown as PluginOption,
      splitVendorChunkPlugin(),
      react(),

      [
        {
          name: "resolve-last-post",
          closeBundle() {
            shelljs.mv("-n", join(root, outDir, cache, "/*"), join(root, outDir, "/"));
            shelljs.rm("-rf", join(root, outDir, cache))
          },
        },
      ],
  
      // createInspect("pre"),
      // createInspect("post"),
    ],
  
    build: {
      rollupOptions: {
        external: /^(.git|.*\.local|dist|node_modules)$/ig,
      },
      outDir,
      assetsDir: "chunks",
    },
  
    root,
    publicDir: false,
    base: "/",
  
    define: {
      __TIME__: new Date().getTime(),
      "import.meta.env.time": new Date().getTime(),
      VITE_TIME: new Date().getTime(),
    },
  };
});