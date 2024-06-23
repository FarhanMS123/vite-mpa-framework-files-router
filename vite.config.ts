import { PluginOption, defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { InputValue, __prepare_cbro_input, __push_rollup_input, virtualRouter } from './src/vite-virtual-file-router/files-router'
import { showConfig } from './src/plugin/inspect'
import fg from "fast-glob";
import mm from "micromatch"
import path from "path";
import { abs2rel, defaultExcluded, jtx_main, pattern_html, pattern_index, pattern_js_ts, pattern_jsx_tsx, src2page } from './src/vite-virtual-file-router/templates'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // showConfig,
    // DynamicPublicDirectory(["./**"], {
    //    ignore: [...defaultExcluded],
    // }) as unknown as PluginOption,
    // showConfig,
    virtualRouter(async ({ config, env }) => {
      const files: InputValue[] = [];
      const cwd = config.root!;

      const cbro_input = __prepare_cbro_input(config);

      const pattern = [pattern_jsx_tsx, pattern_js_ts, pattern_html];
      const mmOpts: fg.Options = {
        baseNameMatch: true,
        caseSensitiveMatch: false,
        onlyFiles: true,
        ignore: defaultExcluded,
        cwd,
        dot: true,
        // braceExpansion: true,
        globstar: true,
        extglob: true,
        markDirectories: true,
        onlyDirectories: false,
      };
      const _files = await fg(pattern, mmOpts);
      
      for ( const script_src of _files ) {
        const __files: InputValue[] = [];
        if (mm.isMatch(script_src, mm.braces(pattern_js_ts, { expand: true }), mmOpts))
          __files.push(...src2page({ cwd, script_src }));
        else if (mm.isMatch(script_src, mm.braces(pattern_jsx_tsx, { expand: true }), mmOpts))
          __files.push(...src2page({ cwd, script_src, main_out: { out: `${abs2rel(cwd, script_src)}.tsx`, raw: jtx_main } }))
        else if (mm.isMatch(script_src, pattern_html, mmOpts))
          __files.push({ is_virtual: false, out: path.resolve(script_src), raw: () => undefined })

        for (const file of __files)
          if (file.out.match(/\.page\.\w\.html$/ig))
            file.out = `${file.out.replaceAll(/\.page\.\w\.html$/ig, "")}/index.html`;
        
        files.push(...__files);
      }

      return {
        files,
      };
    }),
    showConfig,
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
});