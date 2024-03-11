import { readFileSync } from "fs";
import { PREFIX, type InputFunc, InputValue, Option } from "./files-router";

export const pattern_no_folder = "**";
export const beNoFolder: InputFunc = ({ current }) => {
    current.out = current.script_src + ".html";
};

export const pattern_html = "**/*.html";
export const loadHtml: InputFunc = ({ input, script_src }) => {
    input[script_src] = {
        raw: "",
        script_src,
        out: null,
    };
    return input[script_src];
}

export const pattern_vue = "**/*.page.vue";
export const script_vue = readFileSync("../utils/main_vue.tsx").toString();
export const loadVue: InputFunc = ({ input, script_src, out, raw }) => {
    const _input: InputValue = {
        raw: script_vue,
        script_src,
        out: `${script_src}.ts`,
    };
    const virtual = `${PREFIX}${out}`;
    input[virtual] = _input;

    return {
        raw,
        script_src: virtual,
        out,
    };
}

export const defaultExcluded = [".git/**", "*.local/**", "src/**", "dist/**", "node_modules/**"];
export const defaultIncluded = [pattern_html, "**/*.page.tsx", "**/*.page.ts", "**/*.page.js"];
export const extendedIncluded = ["**/*.html", "**/*.page.tsx", pattern_vue, "**/*.md", "**/*.page.ts", "**/*.page.js"];

export const defaultPages: Option["pages"] = [
    { [pattern_no_folder]: beNoFolder, },
    { [pattern_html]: loadHtml, },
    { [pattern_vue]: loadVue, },
];