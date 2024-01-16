import { PluginOption, UserConfig } from "vite";
import { type GlobOptionsWithFileTypesUnset, glob } from "glob";

export const defaultExcluded = [".git", ".cache.local", "src", "dist", "node_modules"];
export const defaultIncluded = [".html", ".page.tsx", ".page.ts", ".page.js"];
export const extendedIncluded = [".html", ".page.tsx", ".page.vue", ".md", ".page.ts", ".page.js"];
export const pattern = (excluded: string[], included: string[]) => `!(${ excluded.join("|") })/**/*@(${ included.join("|") })`;

export const traversFiles = async ({ included, excluded, opts }: {
    included?: string[];
    excluded?: string[];
    opts?: GlobOptionsWithFileTypesUnset;
}) => {
    included = included ?? defaultIncluded;
    const files = await glob(pattern(excluded ?? defaultExcluded, included), {
        nodir: true,
        ...opts,
    });

    const data: {
        name: string;
        filename: string;
        entryFilename: string;
        data: {
            SCRIPT_SRC: string;
        } & Record<string, unknown>;
    }[] = [];
    const input: UserConfig["build"]["rollupOptions"]["input"] = {};
    const output: UserConfig["build"]["rollupOptions"]["output"] = [];

    const cwd = process.cwd();

    for (const filename of files) {
        
        // this would randomly rename the file to .html, for example:
        // `a-file.page.tsx` and `a-file.page.vue` may just one to be rendered.
        const rel = filename.slice(0, cwd.length) == cwd ? filename.slice(cwd.length + 1) : filename;
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
        data.push({
            name,
            entryFilename: `${name}.html`,
            filename: filename,
            data: {
                SCRIPT_SRC: filename,
            },
        });
    }

    console.log(input, output, data);

    return {
        transformIndexHtml: {
            order: "pre",
            handler: (html, ctx) => ({
                html: "",
                tags: [],
            })
        },
        config(config, env) {
            return {

            };
        },
    } as PluginOption;
};