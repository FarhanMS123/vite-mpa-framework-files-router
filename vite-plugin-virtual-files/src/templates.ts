import { readFile, access as fsAccess, constants as fsConst } from "fs/promises";
import { type RawFunc, type InputValue, InputValue_Virtual } from "./files-router";
import { join } from "path/posix";
import { fileURLToPath } from 'url';
import { isAbsolute, relative, dirname, join as joinOri } from "path";
import type {Options as FGOptions} from "fast-glob";

// be* is configure the `out` by `script_src`; with no respect to default `out`
// load* is configure `input` and `return` by `script_src`; respect to/without modifying the `out`

export type MetaCrawler = {
    index?: boolean; // true
    out_foler?: boolean; // true
    full_name?: boolean; // false
    always_use_main?: boolean; // false
};

export const pattern_js_ts = "{,**/}*.page.{ts,js,jsm}";
export const pattern_jsx_tsx = "{,**/}*.page.{tsx,jsx}";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const __dir = __dirname;
export const jtx_main = readFile(joinOri(__dir, "../src/template/main_react.tsx"), { encoding: "utf8" });

export const pattern_out_html = "*.page.*.html";
export const pattern_out_just_html = "*.html.page.*.html";
export const pattern_index_page_html = "index.page.*.html";
export const pattern_html = "{,**/}*.html";

export type SRC2PAGE_params = {
    script_src: string,
    index_out?: string,
    main_out?: {
        out?: string;
        basedir?: string;
        raw: RawFunc;
    },
};
export const src2page = async ({
    index_out,
    script_src,
    main_out,
    raw_html,
    labels, virtuals,
}: {
    raw_html?: RawFunc;
} & SRC2PAGE_params & Pick<InputValue_Virtual, "labels" | "virtuals">) => { // handle virtuals, not env vars
    const ret: InputValue[] = [];

    index_out ??= `${script_src}.html`;

    if (main_out) {
        main_out.out ??= `${script_src}.ts`;
        ret.push({
            out: main_out.out,
            basedir: main_out.basedir,
            isRollupInput: false,
            raw: main_out.raw,
            virtuals,
            labels: {
                ...labels,
                SCRIPT_SRC: script_src,
            },
        });
    }

    ret.unshift({
        out: index_out,
        raw: raw_html ?? ((...params) => readFile(joinOri(__dir, "template/withroot.html"), { encoding: "utf8" })),
        virtuals: {
            SCRIPT_SRC: main_out?.out ?? undefined,
            ...virtuals,
        },
        labels: {
            SCRIPT_SRC: main_out?.out ? undefined : script_src,
            ...labels,
        },
    });

    return ret;
};

// **/home.page.vue -> home/index.html, home/main.ts, **/home.page.vue
//                  -> home.page.vue/index.html, home.page.vue/main.ts, **/home.page.vue
//                  -> home.html, **/home.page.vue.main.ts, **/home.page.vue
//                  -> **/home.page.vue.html, ...
//                  -> **/home/index.html, **/home.page.vue.main.ts, **/home.page.vue
export const pattern_vue = "{,**/}*.page.vue";
export const vue_main = () => readFile(joinOri(__dir, "template/main_vue.ts"), { encoding: "utf8" });

export const defaultExcluded = ["{,**/}.git/**", "{,**/}{,*}.local{,/**}", "src/**", "dist/**", "node_modules/**", "public/**", "vite.config.*.*", "vite.*"];
export const defaultIncluded = [pattern_jsx_tsx, pattern_js_ts, pattern_html];
export const extendedIncluded = [pattern_jsx_tsx, pattern_vue, "{,**/}*.md", pattern_js_ts, pattern_html,];

export const mmDefaultOpts: FGOptions = {
    ignore: defaultExcluded,
    onlyFiles: true,
    onlyDirectories: false,
    markDirectories: true,
    caseSensitiveMatch: false,
    dot: true,
    globstar: true,
    extglob: true,
};
