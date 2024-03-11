import { type ConfigEnv, type PluginOption, type UserConfig } from "vite";
import { type GlobOptionsWithFileTypesUnset, glob } from "glob";
import micromatch from "micromatch";
import { relative, resolve, join } from "path";
import { existsSync, mkdirSync, copyFileSync } from "fs";
import process from "process";
import { inspect } from "util";

export const defaultExcluded = [".git/**", "*.local/**", "src/**", "dist/**", "node_modules/**"];
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
    raw: string;
    script_src: string;
    out: string;
};
export type InputFunc = ({ config, env, input, raw, script_src, out }: {
    config: UserConfig;
    env: ConfigEnv;
    input: Record<string, InputValue>;
} & InputValue) => InputValue | null | void;
export type InputSources = {
    [id: string]: InputValue;
};
export type Option = {
    scanDir?: string;
    included?: string[];
    excluded?: string[];
    pages?: {
        [glob: string]: InputFunc;
    }[];
    glob_opts?: GlobOptionsWithFileTypesUnset;
};

export const PREFIX = "\0virtual:" as const;
export const symNull = Symbol(null);
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

export const virtualRouter = async (opts?: Option) => {
    opts ??= {};
    const { glob_opts } = opts;
    let { scanDir, included, excluded, pages } = opts;
    scanDir ??= "src";
    included ??= defaultIncluded;
    excluded ??= defaultExcluded;
    pages ??= [];

    let root: string, files: string[];
    const input: InputSources = {};

    // store every glob to input by key `${PREFIX}${filename}`
    // for whenever a file is traversed, it going check the microatch
    // then if want to add modules like vue, it should override input

    return [
        {
            name: "vite-virtual-router",
            async config(config, env) {
                config.root = config.root ?? process.cwd();
                root = config.root;

                config.build ??= {};
                config.build.rollupOptions ??= {};
                config.build.rollupOptions.input ??= [];
                const cbro_input = config.build.rollupOptions.input;

                files = await glob(included, {
                    cwd: root,
                    ignore: excluded,
                    nodir: true,
                    ...glob_opts,
                });

                for (let filename of files) {
                    filename = relative(root, filename);
                    filename = filename.replaceAll(/\\/g, "/");
                    
                    const _input= {
                        raw: html,
                        script_src: filename,
                        out: `${filename}/index.html`
                    };

                    let v: ReturnType<InputFunc>;

                    for (const p of pages) {
                        const [g, f] = Object.entries(p)[0];
                        if (micromatch.isMatch(filename, g) && (v = f({ config, env, input, ..._input })) )
                            break;
                    }

                    const virtual = `${PREFIX}${v ? v.out : _input.out}`;
                    input[virtual] = v ? v : _input;
                }

                for (const [id, v] of Object.entries(input)) {
                    if (Array.isArray(cbro_input)) cbro_input.push(id);
                        else cbro_input[id] = id;
                }
            },
            resolveId(source, importer, options) {
                return input[source]?.out ?? source;
            },
            load(id, options) {
                const _input = input[`${PREFIX}${id}`];
                let raw = _input?.raw;
                if (!_input) return;
                raw = raw.replaceAll(/%SCRIPT_SRC%/ig, _input.script_src);
                return raw;
            },
            closeBundle() {
                //
            },
        }
    ] as PluginOption;
};