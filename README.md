# File Routers via Vite MPA

> [!IMPORTANT]
> Do not reinvent the wheel! Please use from [awesome-vite](https://github.com/vitejs/awesome-vite) or [rollup/awesone](https://github.com/rollup/awesome).
> You could also find in npm with some convenient naming `vite-plugin-*` or `rollup-plugin-*`.

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

### MPA Plugins
- [ ] [IndexXuan/vite-plugin-mpa](https://github.com/IndexXuan/vite-plugin-mpa)
- [ ] [Miofly/vite-plugin-multi-pages](https://github.com/Miofly/vite-plugin-multi-pages)
- [ ] [emosheeep/vite-plugin-virtual-mpa](https://github.com/emosheeep/vite-plugin-virtual-mpa)
- [ ] vite-plugin-multi-pages

### Templating Plugins
- [ ] vite-plugin-html
- [ ] vite-plugin-html-template
- [ ] vite-plugin-html-template-mpa
- [ ] vite-plugin-simple-html
- [ ] vite-plugin-virtual-html

### Others
- [ ] [bripkens/connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback)

## References

- https://vitejs.dev/guide/env-and-mode.html#env-variables
- https://vitejs.dev/guide/env-and-mode.html#env-files
- https://vitejs.dev/guide/env-and-mode.html#html-env-replacement
- https://github.com/vitejs/awesome-vite#transformers