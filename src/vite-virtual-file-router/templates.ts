import { readFile } from "fs/promises";
import { PREFIX, type RawFunc, type InputValue, type Option } from "./files-router";
import {  } from "path/posix";
import { join, isAbsolute, relative, dirname, basename } from "path";

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
export const jtx_main = () => readFile(join(__dirname, "template/main_react.tsx"), { encoding: "utf8" });

export const pattern_index = "{,**/}*.page.*.html";
export const pattern_html = "{,**/}*.html";

export const abs2rel = (cwd: string, src: string) => isAbsolute(src) ? relative(cwd, src) : src;

export type SRC2PAGE_params = {
    cwd: string,
    script_src: string, 
    index_out?: string, 
    main_out?: {
        out?: string;
        raw: RawFunc;
    },
};
export const src2page = ({
    cwd,
    index_out, 
    script_src,
    main_out,
    labels, virtuals,
}: SRC2PAGE_params & Pick<InputValue, "labels" | "virtuals">) => { // handle virtuals, not env vars
    let ret: InputValue[] = [];

    index_out ??= `${abs2rel(cwd, script_src)}.html`;

    if (main_out) {
        main_out.out ??= `${abs2rel(cwd, script_src)}.ts`;
        ret.push({
            out: main_out.out,
            raw: async (...params) => (await main_out.raw(...params))?.replace(/%SCRIPT_SRC%/ig, script_src),
            virtuals, labels,
        });
    }

    ret.unshift({
        out: index_out,
        raw: async () => {
            let raw = await readFile(join(__dirname, "template/minimal.html"), { encoding: "utf8" })
            if (!main_out?.out) raw = raw.replaceAll(/%SCRIPT_SRC%/ig, script_src);
            return raw;
        },
        virtuals: {
            SCRIPT_SRC: main_out?.out ?? "%SCRIPT_SRC%",
            ...virtuals,
        },
        labels,
    });

    return ret;
};

// **/home.page.vue -> home/index.html, home/main.ts, **/home.page.vue
//                  -> home.page.vue/index.html, home.page.vue/main.ts, **/home.page.vue
//                  -> home.html, **/home.page.vue.main.ts, **/home.page.vue
//                  -> **/home.page.vue.html, ...
//                  -> **/home/index.html, **/home.page.vue.main.ts, **/home.page.vue
export const pattern_vue = "{,**/}*.page.vue";
export const vue_main = () => readFile(join(__dirname, "template/main_vue.ts"), { encoding: "utf8" });

export const __dir = __dirname;
export const pattern_out_html = "*.page.*.html";
export const pattern_index_html = "index.page.*.html";

export const defaultExcluded = ["{,**/}.git/**", "{,**/}*.local{,/**}", "src/**", "dist/**", "node_modules/**", "public/**"];
export const defaultIncluded = [pattern_html, pattern_jsx_tsx, pattern_js_ts];
export const extendedIncluded = [pattern_html, pattern_jsx_tsx, pattern_vue, "{,**/}*.md", pattern_js_ts];