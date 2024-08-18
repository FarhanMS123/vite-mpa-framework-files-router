import { PluginOption, defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { type InputValue, __prepare_cbro_input, __push_rollup_input, virtualRouter } from './src/vite-virtual-file-router/files-router'
// import Inspect, { showConfig } from 'vite-plugin-inspect'
// import createInspect, { showConfig } from './src/plugin/inspect'
import fg from "fast-glob";
import mm from "micromatch"
import path from "path";
import { abs2rel, defaultExcluded, defaultIncluded, jtx_main, mmDefaultOpts, pattern_html, pattern_index_page_html, 
          pattern_js_ts, pattern_jsx_tsx, pattern_out_html, src2page } from './src/vite-virtual-file-router/templates'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    virtualRouter(async ({ config, env }) => {
      const files: InputValue[] = [];
      const cwd = config.root!;

      const cbro_input = __prepare_cbro_input(config);

      const pattern = [...defaultIncluded];
      const mmOpts: fg.Options = {
        ...mmDefaultOpts,
        cwd,
      };
      const _files = await fg(pattern, mmOpts);

      for ( const script_src of _files ) {
        const __files: InputValue[] = [];
        if (mm.isMatch(script_src, pattern_js_ts, mmOpts))
          __files.push(...src2page({ cwd, script_src }));
        else if (mm.isMatch(script_src, pattern_jsx_tsx, mmOpts))
          __files.push(...src2page({ cwd, script_src, main_out: { out: `${abs2rel(cwd, script_src)}.tsx`, raw: jtx_main } }))
        else if (mm.isMatch(script_src, pattern_html, mmOpts))
          __push_rollup_input(cbro_input, path.resolve(script_src))

        for (const file of __files)
          if (file.inject != "file") {
            if (mm.isMatch(file.out, pattern_index_page_html, {...mmOpts, basename: true}))
              file.out = `${file.out.replaceAll(/\.page\.\w+\.html$/ig, "")}.html`;
            else if (mm.isMatch(file.out, pattern_out_html, {...mmOpts, basename: true}))
              file.out = `${file.out.replaceAll(/\.page\.\w+\.html$/ig, "")}/index.html`;
          }
        
        files.push(...__files);
      }

      return {
        files,
      };
    }),
    // showConfig,
    tsconfigPaths({
      loose: true,
    }),
    splitVendorChunkPlugin(),
    react(),
    {
      name: "vite-post-selfbuild",
      async closeBundle() {},
    }
  ],

  build: {
    outDir: "dist",
    assetsDir: "chunks",
  },
  resolve: {
    preserveSymlinks: true,
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