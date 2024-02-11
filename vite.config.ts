import { type PluginOption, defineConfig, splitVendorChunkPlugin, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { relative } from "path";
import { inspect } from "util";

if (!existsSync("./.cache")) mkdirSync("./.cache");

const makeCache = (name: string, data: unknown) => writeFileSync(`./.cache/${new Date().getTime()}_${name}.js`, `(${ inspect(data, true, Infinity, false) })`);

let pos = 1000;

const the_plugin = (order: "post" | "pre") => {
  pos += 13; // Math.floor(Math.random() * 999)
  const tag = pos;
  return {
    name: `the_cacher_${order}_${tag}`,
    transformIndexHtml: {
      order,
      handler: (html, ctx) => {
        makeCache(`${tag}_transformIndexHtml_${order}`, { html, ctx });
        console.log("23");
        return html;
      },
    },
    transform: {
      order,
      handler(code, id, options) {
        makeCache(`${tag}_transform_${order}`, { code, id, options });
        console.log("31");
        return {
          code,
        };
      },
    },
    // resolveId(source, importer, options) {
    //   makeCache(`${tag}_resolveId_${order}`, { source, importer, options });
    // },
    // load(id, options) {
    //   makeCache(`${tag}_load_${order}`, { id, options });
    // },

    // config: {
    //   order,
    //   handler(config, env) {
    //     console.log("here 46 by " + order);
    //   },
    // },
    config: (config, env) => {
      console.log("here 46 by " + order);
      return {
        build: {
          // ? Open this on NodeJS
          // ? (await vite.resolveConfig("vite.config.ts", "build")).build.rollupOptions
          // ? This is become more difficult

          rollupOptions: [
            {
              input: ["x"],
            },
            {
              input: ["y"],
            },
          ],
          // rollupOptions: {
          //     input: ["x"],
          //   },
        }
      };

      // ! not working
      // return [
      //   {
      //     build: {
      //       outDir: "dist/a",
      //     },
      //   },
      //   {
      //     build: {
      //       outDir: "dist/b",
      //     },
      //   },
      // ];
    },
  } as PluginOption;
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        "namamama": "src/index.html",
        // main: "src/other.html",
        // "simp/megamendung.tsx": "index.html",
        "simp/megamendung": "src/other.html",
        // "chunks/main": "src/main.tsx",
      },
      output: {
        // entryFileNames(chunkInfo) {
        //   console.log("59", chunkInfo);
        //   return relative(process.cwd(), chunkInfo.facadeModuleId);
        // },
        // banner: (chunkInfo) => {
        //   console.log("63", chunkInfo);
        //   return "";
        // },
        // footer: (chunkInfo) => {
        //   console.log("67", chunkInfo);
        //   return "";
        // },
        // intro: (chunkInfo) => {
        //   console.log("75", chunkInfo);
        //   return "";
        // },
        // outro: (chunkInfo) => {
        //   console.log("79", chunkInfo);
        //   return "";
        // },
        
        // chunkFileNames: (chunkInfo) => {
        //   console.log("71", chunkInfo);
        //   return "";
        // },
        // sourcemapFileNames: (chunkInfo) => {
        //   console.log("71", chunkInfo);
        //   return "";
        // },
      },
    },
  },
  // [1734, 2199, 3194, 3682]
  plugins: [
    // {
    //   name: "something",
    //   transformIndexHtml: {
    //     order: "pre",
    //     handler: (html) => {
    //       return html;
    //       // return html.replace("%SCRIPT_SRC%", "/src/main.tsx");
    //     },
    //   },
    // },
    the_plugin("pre"),  // 1734
    the_plugin("post"), // 2199
    splitVendorChunkPlugin(),
    react(),
    // the_plugin("pre"),  // 3194
    // the_plugin("post"), // 3682
  ],
});