import { PluginOption, defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { InputValue, __prepare_cbro_input, __push_rollup_input, virtualRouter } from 'vite-virtual-file-router/files-router'
import Inspect from 'vite-plugin-inspect'
import createInspect, { showConfig } from './src/plugin/inspect'
import fg from "fast-glob";
import mm from "micromatch"
import path from "path";
import { abs2rel, defaultExcluded, jtx_main, pattern_html, pattern_index_page_html, 
          pattern_js_ts, pattern_jsx_tsx, pattern_out_html, src2page } from 'vite-virtual-file-router/templates'
import DynamicPublicDirectory from 'vite-multiple-assets';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    DynamicPublicDirectory(["./**"], {
       ignore: [...defaultExcluded],
    }) as PluginOption,
    virtualRouter(async ({ config, env }) => {
      const files: InputValue[] = [];
      const cwd = config.root!;

      const cbro_input = __prepare_cbro_input(config);

      const pattern = [pattern_jsx_tsx, pattern_js_ts, pattern_html];
      const mmOpts: fg.Options = {
        cwd,
        ignore: defaultExcluded,
        onlyFiles: true,
        onlyDirectories: false,
        markDirectories: true,
        caseSensitiveMatch: false,
        dot: true,
        globstar: true,
        extglob: true,
      };
      const _files = await fg(pattern, mmOpts);
      
      for ( const script_src of _files ) {
        const __files: InputValue[] = [];
        if (mm.isMatch(script_src, pattern_js_ts, mmOpts))
          __files.push(...src2page({ cwd, script_src }));
        else if (mm.isMatch(script_src, pattern_jsx_tsx, mmOpts))
          __files.push(...src2page({ cwd, script_src, main_out: { out: `${abs2rel(cwd, script_src)}.tsx`, raw: jtx_main } }))
        else if (mm.isMatch(script_src, pattern_html, mmOpts))
          __files.push({ is_virtual: false, out: path.resolve(script_src), raw: () => undefined })

        for (const file of __files)
          if (file.is_virtual != false) { // file.is_virtual == true || file.is_virtual == ""
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
    splitVendorChunkPlugin(),
    react(),
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