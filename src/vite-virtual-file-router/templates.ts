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

export const pattern_no_folder = "**.page.!(html)";
export const parsePageRelative = ({ cwd, script_src, ext }: {
    cwd: string;
    script_src: string;
    ext: string;
}) => {
    const ret = {
        relative: "",
        out_dir: "",
        filename: "",
        ext: "",
        basename: "",
    };
    ret.relative = isAbsolute(script_src) ? relative(cwd, script_src) : script_src;
    ret.out_dir = dirname(ret.relative);
    ret.filename = basename(ret.relative);
    ret.ext = ext;
    ret.basename = basename(ret.relative, ext);
}
export const jts2page = ({ cwd, script_src, index_out, ...opts }: {
    cwd: string;
} & Pick<SRC2PAGE_params, "script_src"> & Partial<SRC2PAGE_params>) => src2page({
    script_src: script_src,
    index_out: index_out ?? `${isAbsolute(script_src) ? relative(cwd, script_src) : script_src}.html`,
    ...opts
});

export const pattern_index = "**/index.page.!(html)";
export const pattern_html = "**/*.html";

export type SRC2PAGE_params = {
    script_src: string, 
    index_out: string, 
    main_out?: {
        out: string;
        raw: RawFunc;
    },
};
export const src2page = ({
    index_out, 
    script_src,
    main_out,
}: SRC2PAGE_params) => { // handle virtuals, not env vars
    let ret: InputValue[] = [];

    if (main_out) {
        ret.push({
            out: main_out.out,
            raw: async (...params) => (await main_out.raw(...params))?.replace(/%SCRIPT_SRC%/ig, script_src),
            virtuals: {},
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
        },
    });

    return ret;
};

// **/home.page.vue -> home/index.html, home/main.ts, **/home.page.vue
//                  -> home.page.vue/index.html, home.page.vue/main.ts, **/home.page.vue
//                  -> home.html, **/home.page.vue.main.ts, **/home.page.vue
//                  -> **/home.page.vue.html, ...
//                  -> **/home/index.html, **/home.page.vue.main.ts, **/home.page.vue
export const pattern_vue = "**.page.vue";