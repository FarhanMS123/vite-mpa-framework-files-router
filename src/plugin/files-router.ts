import { UserConfig } from "vite";
import { type GlobOptionsWithFileTypesUnset, glob } from "glob";

export const defaultExcluded = [".git", ".cache.local", "src", "dist", "node_modules"];
export const defaultIncluded = [".html", ".page.tsx", ".page.ts", ".page.js"];
export const extendedIncluded = [".html", ".page.tsx", ".page.vue", ".md", ".page.ts", ".page.js"];
export const pattern = (excluded: string[], included: string[]) => `!(${ excluded.join("|") })/**/*@(${ included.join("|") })`;

export const traverFiles = async (included: string[], excluded: string[], opts?: GlobOptionsWithFileTypesUnset) => {
    const files = await glob(pattern(excluded, included), {
        nodir: true,
        ...opts,
    });

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


        if (filename.match(/\.html$/i)) input[filename] = filename;
        else if (typeof input[name] != "string") input[name] = "src/template/default.html";

        output.push({
            name: name,
            entryFileNames: filename,
        });
    }

    return {
        input, output,
    } as UserConfig["build"]["rollupOptions"];
};