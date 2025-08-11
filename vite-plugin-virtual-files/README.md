# File Routers via Vite MPA

- vite-plugin-virtual-files
- vite-virtual-file-router
- vite-mpa-framework-files-router

> [!NOTE]  
> It is a shame that I reinventing the wheel. Please take a look ad development / research has been done in main_v1. Else, you may need Tanstack Virtual File Router instead.

## Development

```
npm run prepare && npm exec vite dev -- -c vite.simple.config.ts --force -l info -d true
```

### ToDo

- [x] cleanup, examples install from .tgz
- [x] make simple sample
- [x] adjust templating to run new file router
- [ ] cleanup and refactoring templating
- [ ] cleanup and refactoring file router
- [x] could be installed by npm and loaded to simple ts
- [ ] could be installed by yarn and loaded to simple ts
- [x] could be installed by pnpm and loaded to simple ts
- [x] vite ts could import js (dist)
  - [x] vite js, mjs, cjs could import js (dist)
  - [ ] vite ts could import ts (src)
- [ ] working with auto import by glob
- [ ] `tsc -b` build only to single vite config ts instead of all ts file
- [x] capabilities to server virtual html and files related when `vite dev`
  - [ ] only import on html tag
  - [ ] handle on js and by required or import; can be the \0 resolveId ([Understanding Virtual Modules in Vite and Webpack: A Modern Approach to Module Federation | by Mohammad Hossein Mazandaranian | Jun, 2025 | Medium](https://medium.com/@modos.m98/understanding-virtual-modules-in-vite-and-webpack-a-modern-approach-to-module-federation-c45985c47e35))
  - [ ] router on root `/` redirect/mirror to x00
  - [ ] separate plugin for server
  - [ ] hot reload on index html
  - [ ] hot reload on virtual module; change basedir to watch (if string is file, and numbers in seconds)
- [x] uninstall glob and micromatch, and install as peer
- [x] update README and remove the development phase
- [ ] rename package to @beanprint/
- [ ] upload to npmjs