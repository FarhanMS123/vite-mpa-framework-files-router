import { type PluginOption, type UserConfig } from "vite";
import { type GlobOptionsWithFileTypesUnset, glob } from "glob";
import { relative, resolve, join } from "path";
import { existsSync, mkdirSync, copyFileSync } from "fs";
import process from "process";

export const defaultExcluded = ["**/.git", "**/*.local", "**/src", "**/dist", "**/node_modules"];
export const defaultIncluded = ["**/*.html", "**/*.page.tsx", "**/*.page.ts", "**/*.page.js"];
export const extendedIncluded = [".html", ".page.tsx", ".page.vue", ".md", ".page.ts", ".page.js"];
export const pattern = (excluded: string[], included: string[]) => `!(${ excluded.join("|") })/**/*@(${ included.join("|") })`;

export type CustomUserConfig = UserConfig & {
    file_router?: {
        relative?: string;
        absolute?: string;
    },
};

export type DataStore = {
    relative: string;
    absolute: string;
    entryFilename: string; // output

    template?: string;
    data: {
        SCRIPT_SRC: string;
    } & Record<string, unknown>;
};

export const traversFiles = async (params?: {
    included?: string[];
    excluded?: string[];
    opts?: GlobOptionsWithFileTypesUnset;
}) => {
    let { included, } = params;
    const { excluded, opts, } = params;
    included = included ?? defaultIncluded;

    let cwd = "";
    const data: Record<string, DataStore> = {};
    let input: UserConfig["build"]["rollupOptions"]["input"] = {};
    
    const cache_wd = resolve(process.cwd(), ".travers-files.local");
    if (!existsSync(cache_wd))
        mkdirSync(cache_wd, { recursive: true, });

    return [
        {
            name: "rollup-plugin-multi-index-file-router",
            transformIndexHtml: {
                order: "pre",
                handler: (html, ctx) => {
                    return {
                        html: html,
                        tags: [],
                    };
                }
            },
            async config(config, env) {
                input = {};
                cwd = config.root ?? process.cwd();
                
                const files = await glob(pattern(excluded ?? defaultExcluded, included), {
                    cwd,
                    nodir: true,
                    ...opts,
                });
    
                for (const filename of files) {
                    // there is no need to randomly rename the file to .html, for example:
                    // `a-file.page.tsx` and `a-file.page.vue` may become 
                    // `a-file.page.ts.html` and `a-file.page.vue.html`
                    const rel = relative(cwd, filename);
    
                    if (rel.match(/\.html$/i)) copyFileSync(filename, join(cache_wd, rel));
                    else copyFileSync("src/template/clean.html", join(cache_wd, rel));
                }
    
                return {
                    build: {
                        rollupOptions: {
                            input,
                        }
                    },
                    root: cache_wd,
                    publicDir: config.publicDir ? resolve(cwd, config.publicDir) : config.publicDir,
                };
            },
        },
        {
            name: "vite-plugin-file-incompile-hooks",
        },
    ] as PluginOption;
};

export type InputValue = {
    id: string;
    raw: string;
    script_src: string;
    out: string;
};
export type InputFunc = ({ input, id, raw, script_src, out }: {
    input: InputValue;
} & InputValue) => InputValue;
export type InputSources = {
    [id: string]: InputValue;
};
export type Option = {
    scanDir?: string;
    root?: string;
    included?: string[];
    excluded?: string[];
    pages?: {
        [glob: string]: InputFunc;
    }[];
    glob_opts?: GlobOptionsWithFileTypesUnset;
};

export const PREFIX = "\0virtual:" as const;
export const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <script type="module" src="%SCRIPT_SRC%"></script>
  </body>
</html>`;
export const script_vue = `import { createApp } from 'vue'
import App from '%SCRIPT_SRC%'
createApp(App).mount('#app')`;

export const virtualRouter = async (opts: Option) => {
    const { glob_opts } = opts;
    let { root, scanDir, included, excluded } = opts;
    scanDir = scanDir ?? "src";
    included = included ?? defaultIncluded;
    excluded = excluded ?? defaultExcluded;

    const input: InputSources = {};

    // store every glob to input by key `${PREFIX}${filename}`
    // for whenever a file is traversed, it going check the microatch
    // then if want to add modules like vue, it should override input

    return [
        {
            name: "vite-virtual-router",
            async config(config, env) {
                config.root = config.root ?? process.cwd();
                root = root ?? config.root;

                config.build ??= {};
                config.build.rollupOptions ??= {};
                config.build.rollupOptions.input ??= [];
                const cbro_input = config.build.rollupOptions.input;

                const files = await glob(included, {
                    cwd: root,
                    ignore: excluded,
                    nodir: true,
                    ...glob_opts,
                });

                for (const filename of files) {
                    const virtual = `${PREFIX}${filename}`;
                    if (Array.isArray(cbro_input)) cbro_input.push(virtual);
                        else cbro_input[virtual] = virtual;
                    
                    input[virtual] = {
                        id: virtual,
                        raw: html,
                        script_src: filename,
                        out: `${filename}/index.html`
                    };
                }
            },
            resolveId(source, importer, options) {
                //
            },
            load(id, options) {
                //
            },
            closeBundle() {
                //
            },
        }
    ] as PluginOption;
};