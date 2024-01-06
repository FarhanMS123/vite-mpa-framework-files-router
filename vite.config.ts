import { type PluginOption, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { inspect } from "util";

if (!existsSync("./.cache")) mkdirSync("./.cache");

const makeCache = (name: string, data: any) => writeFileSync(`./.cache/${new Date().getTime()}_${name}.js`, `(${ inspect(data, true, Infinity, false) })`);

const the_plugin = (order: "post" | "pre") => {
  const tag = Math.floor(Math.random() * 9999);
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
  plugins: [
    react(),
    the_plugin("pre"),
    the_plugin("post"),
  ],
})
