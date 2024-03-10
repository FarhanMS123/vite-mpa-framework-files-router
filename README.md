# File Routers via Vite MPA

> [!IMPORTANT]
> Do not reinvent the wheel! Please use from [awesome-vite](https://github.com/vitejs/awesome-vite) or [rollup/awesone](https://github.com/rollup/awesome).
> You could also find in npm with some convenient naming `vite-plugin-*` or `rollup-plugin-*`.

> [!WARNING]  
> I hope whatever the final of this project would be, it should not be a library, plugins, or anything. THIS PROJECT SHOULD BE JUST 
> AND ONLY A TEMPLATE. If there is no plugin could fullfil the objective of this project perfectly, this project would be going as
> is without being a new plugin. DO NOT REINVENT THE WILL. It is better to just contributing to one of these plugins which are still
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
- [ ] [IndexXuan/vite-plugin-mpa](https://github.com/IndexXuan/vite-plugin-mpa)
  - primaryly using `connect-history-api-fallback`, `fast-glob`
  - additionally using `yargs`, `shelljs`
  - setting config using `config.` instead of `return config`
  - `shelljs` used to move and remove `.html` files
  - purpose to find main js file and use the 
  - ~great to proof read further~
  - there exists `index.html` in every pagination, so not much what I see.
  - no `data` manipulation
- [ ] [Miofly/vite-plugin-multi-pages](https://github.com/Miofly/vite-plugin-multi-pages)
  - It looks same as above, but no `shelljs` and no removing
- [ ] [emosheeep/vite-plugin-virtual-mpa](https://github.com/emosheeep/vite-plugin-virtual-mpa)
  - additionally using `html-minifier-terser`, `picocolors`, `ejs`, `fs`, `connect-history-api-fallback`
  - using `fs.readdir` to do traverse files
  - template html on root, and traversing js
  - https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
  - `resolveId` is absolute path
  - creating virtual module
- [ ] [zhuweiyou/vite-plugin-mp](https://github.com/zhuweiyou/vite-plugin-mp)
  - using `glob`
  - only MPA without virtualization
  - only mergeConfig
- [ ] [yzydeveloper/vite-plugin-mpa-plus](https://github.com/yzydeveloper/vite-plugin-mpa-plus)
  - additionally using `ejs`, `connect-history-api-fallback`, `fs`, `node-html-parser`
  - user provide list of index.html

### Templating Plugins
- [ ] [vbenjs/vite-plugin-html](https://github.com/vbenjs/vite-plugin-html)
- [ ] [IndexXuan/vite-plugin-html-template](https://github.com/IndexXuan/vite-plugin-html-template)
- [ ] [Miofly/vite-plugin-html-template-mpa](https://github.com/Miofly/vite-plugin-html-template-mpa)
- [ ] [wojtekmaj/vite-plugin-simple-html](https://github.com/wojtekmaj/vite-plugin-simple-html)
- [ ] [windsonR/vite-plugin-virtual-html](https://github.com/windsonR/vite-plugin-virtual-html)
- [ ] [iamspark1e/vite-plugin-auto-mpa-html](https://github.com/iamspark1e/vite-plugin-auto-mpa-html)
- [ ] [vituum/vite-plugin-handlebars](https://github.com/vituum/vite-plugin-handlebars)

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