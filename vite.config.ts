import { type PluginOption, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import { writeFileSync, existsSync, mkdirSync } from "fs";
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
        return html;
      },
    },
    transform: {
      order,
      handler(code, id, options) {
        makeCache(`${tag}_transform_${order}`, { code, id, options });
        return {
          code,
        };
      },
    },
  } as PluginOption;
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        main: "src/other.html",
        "simp/megamendung": "index.html",
        // "chunks/main": "src/main.tsx",
      }
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
    // the_plugin("pre"),  // 1734
    // the_plugin("post"), // 2199
    react(),
    // the_plugin("pre"),  // 3194
    // the_plugin("post"), // 3682
  ],
})
