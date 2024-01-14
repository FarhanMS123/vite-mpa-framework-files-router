import { UserConfig } from "vite";
import { type GlobOptionsWithFileTypesUnset, glob } from "glob";

export const defaultPattern = "!(.git|.cache.local|src|dist|node_modules)/**/*.@(html|page.tsx|page.ts|page.js)";
export const extendedPattern = "!(.git|.cache.local|src|dist|node_modules)/**/*.@(html|page.tsx|page.vue|md|page.ts|page.js)";

export const traverFiles = async (pattern: string | string[], opts?: GlobOptionsWithFileTypesUnset) => {
    const files = await glob(pattern, opts);

    const input: UserConfig["build"]["rollupOptions"]["input"] = {};
    const output: UserConfig["build"]["rollupOptions"]["output"] = [];

    for (const filename of files) {
        if (filename.match(/\.html$/i)) input[filename] = filename;
        else input[filename] = "src/template/default.html";

        output.push({
            name: filename,
            entryFileNames: filename,
        });
    }

    return {
        input, output,
    } as UserConfig["build"]["rollupOptions"];
};