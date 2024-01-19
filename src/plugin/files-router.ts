import { PluginOption, UserConfig } from "vite";
import { type GlobOptionsWithFileTypesUnset, glob } from "glob";
import { relative } from "path";

export const defaultExcluded = [".git", "*.local", "src", "dist", "node_modules"];
export const defaultIncluded = [".html", ".page.tsx", ".page.ts", ".page.js"];
export const extendedIncluded = [".html", ".page.tsx", ".page.vue", ".md", ".page.ts", ".page.js"];
export const pattern = (excluded: string[], included: string[]) => `!(${ excluded.join("|") })/**/*@(${ included.join("|") })`;

export const traversFiles = async (params?: {
    included?: string[];
    excluded?: string[];
    opts?: GlobOptionsWithFileTypesUnset;
}) => {
    let { included, } = params;
    const { excluded, opts, } = params;
    included = included ?? defaultIncluded;

    const data: {
        [name: string]: {
            name: string;
            filename: string;
            entryFilename: string;
            data: {
                SCRIPT_SRC: string;
            } & Record<string, unknown>;
        }
    } = {};
    let input: UserConfig["build"]["rollupOptions"]["input"] = {};
    let output: UserConfig["build"]["rollupOptions"]["output"] = [];

    return {
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
            output = [];
            const cwd = config.root ?? process.cwd();
            
            const files = await glob(pattern(excluded ?? defaultExcluded, included), {
                cwd,
                nodir: true,
                ...opts,
            });

            for (const filename of files) {
                // this would randomly rename the file to .html, for example:
                // `a-file.page.tsx` and `a-file.page.vue` may just one to be rendered.
                const rel = relative(cwd, filename);
                const rgExt = RegExp(`(${ included.join("|").replace(/\./ig, "\\.") })$`, "i");
                const trExt = rel.slice(rel.search(rgExt) + 1).split(".");
                let name = rel.replace(rgExt, "");

                for (let i=trExt.length; i>=0; i--) {
                    const join = `${ i == trExt.length ? "" : "_" }${ trExt.slice(i).join("_") }`;
                    if (typeof input[`${ name }${ join }`] != "string") {
                        name += join;
                        break;
                    }
                }

                if (typeof input[name] == "string") continue;

                if (rel.match(/\.html$/i)) input[name] = rel;
                else if (typeof input[name] != "string") input[name] = "src/template/default.html";

                output.push({
                    name,
                    entryFileNames: rel,
                });
                data[name] = {
                    name,
                    entryFilename: `${name}.html`,
                    filename: filename,
                    data: {
                        SCRIPT_SRC: filename,
                    },
                };
            }

            return {
                build: {
                    rollupOptions: {
                        input, output,
                    }
                },
            };
        },
    } as PluginOption;
};