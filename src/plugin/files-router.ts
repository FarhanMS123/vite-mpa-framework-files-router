import { type PluginOption, type UserConfig } from "vite";
import { type GlobOptionsWithFileTypesUnset, glob } from "glob";
import { relative, resolve, join } from "path";
import { existsSync, mkdirSync, copyFileSync } from "fs";

export const defaultExcluded = [".git", "*.local", "src", "dist", "node_modules"];
export const defaultIncluded = [".html", ".page.tsx", ".page.ts", ".page.js"];
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