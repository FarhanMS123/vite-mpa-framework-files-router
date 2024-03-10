# File Routers via Vite MPA

> [!IMPORTANT]
> Do not reinvent the wheel! Please use from [awesome-vite](https://github.com/vitejs/awesome-vite) or [rollup/awesone](https://github.com/rollup/awesome).
> You could also find in npm with some convenient naming `vite-plugin-*` or `rollup-plugin-*`.

> [!WARNING]  
> I hope whatever the final of this project would be, it should not be a library, plugins, or anything. THIS PROJECT SHOULD BE JUST 
> AND ONLY A TEMPLATE. If there is no plugin could fullfil the objective of this project perfectly, this project would be going as
> is without being a new plugin. DO NOT REINVENT THE WHEEL. It is better to just contributing to one of these plugins which are still
> in research. 

## TODO
- [x] No `public`
- [x] Copy all folders and files except `.dist`, `node_modules`, `src`,  and `.git`
- [ ] Import `src/page-name.tsx`, use `src/clean.html`, then put to `.dist` and `.dist/chunks`
- [ ] Get all `lowercase_alpha-numb3r1c_kebab-snake_case.{html,tsx,jsx,vue,md}` to be page
- [ ] Implement to `lowercase_alpha-numb3r1c_kebab-snake_case.*.html` for convenience...
- [ ] ...except `index.*` and `README.md`
- [ ] `README.md` should not be rendered, but manually by dedicated `index.html#path/to/readme.md`
- [x] Store in `.dist` inside `chunks` instead of `assets`.
- [x] Activate Github Runner to compile as pages

```css
/* .html would be parsed using handlebars */
.html, .hbs, .ejs, .haml, .md,
.page.tsx, .page.jsx, .page.vue, .page.ts, .page.js
page-file.page.tsx -> page-file.html
```

## Plugin Research

### What to find?
- How pagination works
- What would it do to clean it mess
- What would it do to end the builds
- How `data` can be set
- search word `data` on source code. It could be shown to the near of the beginning

### MPA Plugins
- [x] [IndexXuan/vite-plugin-mpa](https://github.com/IndexXuan/vite-plugin-mpa)
  - primaryly using `connect-history-api-fallback`, `fast-glob`
  - additionally using `yargs`, `shelljs`
  - setting config using `config.` instead of `return config`
  - `shelljs` used to move and remove `.html` files
  - purpose to find main js file and use the 
  - ~great to proof read further~ worth studying
  - there exists `index.html` in every pagination, so not much what I see.
  - no `data` manipulation
- [ ] [Miofly/vite-plugin-multi-pages](https://github.com/Miofly/vite-plugin-multi-pages)
  - It looks same as above, but no `shelljs` and no removing
- [x] [emosheeep/vite-plugin-virtual-mpa](https://github.com/emosheeep/vite-plugin-virtual-mpa)
  - additionally using `html-minifier-terser`, `picocolors`, `ejs`, `fs`, `connect-history-api-fallback`
  - using `fs.readdir` to do traverse files
  - template html on root, and traversing js
  - https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
  - `resolveId` is absolute path
  - creating virtual module
  - worth studying
- [ ] [zhuweiyou/vite-plugin-mp](https://github.com/zhuweiyou/vite-plugin-mp)
  - using `glob`
  - only MPA without virtualization
  - only mergeConfig
- [ ] [yzydeveloper/vite-plugin-mpa-plus](https://github.com/yzydeveloper/vite-plugin-mpa-plus)
  - additionally using `ejs`, `connect-history-api-fallback`, `fs`, `node-html-parser`
  - user provide list of index.html
- [x] [windsonR/vite-plugin-virtual-html](https://github.com/windsonR/vite-plugin-virtual-html)
  - using `fs`, `debug`, `fast-glob`
  - issue windsonR/vite-plugin-virtual-html#38
  - has tested, no respect to `build.rollupOptions.external`
  - very worth studying
  - template wrote as variables in code
  - structed as OOP
- [ ] [iamspark1e/vite-plugin-auto-mpa-html](https://github.com/iamspark1e/vite-plugin-auto-mpa-html)
  - using `fs`, `ejs`, `url`, `glob`,
  - `resolveId` must absolute https://github.com/vitejs/vite/issues/9771
  - template as variables
  - using virtual module
  - I actually did not understand how to use it, no examples
  - worth studying, but low expectation

### Templating Plugins
- [ ] [vbenjs/vite-plugin-html](https://github.com/vbenjs/vite-plugin-html)
  - using `fs-extra`, `pathe`, `fast-glob`, `connect-history-api-fallback`, `dotenv`, `dotenv-expand`
  - additionally using `consola`, `ejs`, `node-html-parser`, `colorette`, `html-minifier-terser`, `@rollup/pluginutils`
  - looks like user is providing the source
  - long not maintained, issue vbenjs/vite-plugin-html#144
- [x] [IndexXuan/vite-plugin-html-template](https://github.com/IndexXuan/vite-plugin-html-template)
  - relay on `vite-plugin-mpa`
  - using `shelljs`, `fs`, `lodash`
  - https://github.com/rollup/plugins/blob/master/packages/virtual/src/index.ts
  - most plugins cautionious with win path
  - worth studying
- [x] [Miofly/vite-plugin-html-template-mpa](https://github.com/Miofly/vite-plugin-html-template-mpa)
  - relaying on `vite-plugin-multi-pages`
  - using `fs`, `ejs`
  - additionally use `shelljs`, `crypto` for hash, `html-minifier-terser`
  - there is template here
  - worth studying
- [ ] [wojtekmaj/vite-plugin-simple-html](https://github.com/wojtekmaj/vite-plugin-simple-html)
  - additionally using `html-minifier-terser`
  - not meet my requirement
- [ ] [vituum/vite-plugin-handlebars](https://github.com/vituum/vite-plugin-handlebars)
  - relaying on `vituum`, `fs`, `fast-glob`, `handlebars`
  - because the code are clean, it is worth studying to build a plugin

### Others
- [ ] [vitejs/vite-plugin-react-pages](https://github.com/vitejs/vite-plugin-react-pages)
- [ ] [hannoeru/vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)
- [ ] [bripkens/connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback)

## References

- https://vitejs.dev/guide/env-and-mode.html#env-variables
- https://vitejs.dev/guide/env-and-mode.html#env-files
- https://vitejs.dev/guide/env-and-mode.html#html-env-replacement
- https://github.com/vitejs/awesome-vite#transformers
- https://vituum.dev/