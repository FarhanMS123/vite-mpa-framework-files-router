# File Routers via Vite MPA

> [!IMPORTANT]
> Do not reinvent the wheel! Please use from [awesome-vite](https://github.com/vitejs/awesome-vite) or [rollup/awesone](https://github.com/rollup/awesome).
> You could also find in npm with some convenient naming `vite-plugin-*` or `rollup-plugin-*`.

> [!WARNING]  
> I hope whatever the final of this project would be, it should not be a library, plugins, or anything. THIS PROJECT SHOULD BE JUST 
> AND ONLY A TEMPLATE. If there is no plugin could fullfil the objective of this project perfectly, this project would be going as
> is without being a new plugin. DO NOT REINVENT THE WHEEL. It is better to just contributing to one of these plugins which are still
> in research. 

> [!NOTE]  
> If you want to see research file, please consider to take alook to [READMME_research.md](./README_research.md).

## Usage

1. Please initialize Vite using [official guidelines](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
2. Remove `src/`, `index.html`, and `public/` (recommended)
3. Copy `src/` from this project to your workdir
4. Install dependencies below as devDependencies

```bash
npm i -D micromatch glob @types/micromatch @types/node

# ADDITIONAL
npm i -D shelljs vite-plugin-inspect @types/shelljs

### Live TS Runtime
npm i -D tsx
npm exec tsx

### or overhead execution without download
npm dlx tsx
npx tsx
```

5. See [`vite.config.ts`](./vite.config.ts) for minimal configuration or [`vite.complete.config.ts`](vite.complete.config.ts) for further configuration
6. Configure your [`.eslintrc.cjs`](./.eslintrc.cjs) as follows

```ts
module.exports = {
  ignorePatterns: [..., "src/utils/main_**"],
  rules: {
    ...,
    '@typescript-eslint/no-unused-vars': 'warn',
  },
}
```

7. Add `["ESNext", "DOM"]` to `compilerOptions.lib` in `tsconfig.node.json`
8. Exclude `src/utils/main_**` in both `tsconfig.json` and `tsconfig.node.json`