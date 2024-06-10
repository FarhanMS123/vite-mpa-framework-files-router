import { readFileSync, existsSync } from "fs";
import { PREFIX, type InputFunc, InputValue, Option } from "./files-router";
import { dirname, basename, extname, join } from "path";

// be* is configure the `out` by `script_src`; with no respect to default `out`
// load* is configure `input` and `return` by `script_src`; respect to/without modifying the `out`

export const pattern_no_folder = "**.page.!(html)";
export const beNoFolder: InputFunc = ({ current, script_src }) => {
    current.out = script_src + ".html";
};
export const beFolderNoConflict: InputFunc = ({ config, current, out, script_src }) => {
    // filename.levelA.levelB.levelC.idA.idB.idC.ext
    // filename.*.page.ext
    //
    // filename.levelA.levelB.levelC
    // filename.levelA.levelB.levelC_ext
    // filename.levelA.levelB.levelC_ext_#    # >= 2
    const ext = extname(script_src!).slice(1);
    const file = script_src.slice(0, script_src.search(/(\.[^./]+){2}$/ig)); // remove .page.ext
    current.out = file;
    if (existsSync(join(config.root!, current.out))) current.out += `_${ext}`;

    if (existsSync(join(config.root!, current.out))) {
        const max = Math.ceil(40 * Math.random());
        for (let i = 2; i <= max; i++) {
            if (existsSync(join(config.root!, `${current.out}_${i}`))) {
                if (i == max) current.out = out;
                else continue;
            }
            current.out += `_${i}`;
            break;
        }
    }
};

export const pattern_index = "**/index.page.!(html)";
export const beIndex: InputFunc = ({ current }) => {
    current.out = `${dirname(current.script_src!)}/index.html`;
};

export const pattern_html = "**/*.html";
export const loadHtml: InputFunc = ({ input, script_src }) => {
    input[script_src] = {
        raw: "",
        script_src, // /path/to/filename.html; no foldering
        out: null,
    };
    return input[script_src];
}

export const pattern_vue = "**.page.vue";
export const script_vue = readFileSync(join(__dirname, "../utils/main_vue.ts")).toString();
export const loadVue: InputFunc = ({ input, script_src, out, raw }) => {
    const _input: InputValue = {
        raw: script_vue,
        script_src, // filename.vue
        out: `${script_src}.ts`, // filename.vue.ts
    };
    const virtual = `${PREFIX}${out}`;
    input[virtual] = _input;

    return {
        raw,
        script_src: virtual, // \0virtual:filename.vue.ts
        out,
    };
}

export const defaultExcluded = [".git/**", "*.local/**", "src/**", "dist/**", "node_modules/**", "public/**"];
export const defaultIncluded = [pattern_html, "**.page.tsx", "**.page.ts", "**.page.js"];
export const extendedIncluded = ["**.html", "**.page.tsx", pattern_vue, "**.md", "**.page.ts", "**.page.js"];

export const defaultPages: Option["pages"] = [
    { [pattern_no_folder]: beFolderNoConflict, },
    { [pattern_index]: beIndex, },
    { [pattern_html]: loadHtml, },
    { [pattern_vue]: loadVue, },
];