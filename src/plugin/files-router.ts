import { type ConfigEnv, type PluginOption, type UserConfig } from "vite";
import { type GlobOptionsWithFileTypesUnset, glob } from "glob";
import micromatch from "micromatch";
import { relative } from "path";
import process from "process";
import { inspect } from "util";
import { defaultExcluded, defaultIncluded, defaultPages } from "./templates";

export type InputValue = {
    raw: string;
    script_src: string;
    out: string | null;
};
export type InputFunc = ({ config, env, input, raw, script_src, out }: {
    config: UserConfig;
    env: ConfigEnv;
    input: Record<string, InputValue>;
} & InputValue) => InputValue | null | void;
export type InputSources = {
    [id: string]: InputValue;
};
export type Option = {
    scanDir?: string;
    included?: string[];
    excluded?: string[];
    pages?: {
        [glob: string]: InputFunc;
    }[];
    glob_opts?: GlobOptionsWithFileTypesUnset;
};

export const PREFIX = "\0virtual:" as const;
export const symNull = Symbol(null);
export const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <script type="module" src="%SCRIPT_SRC%"></script>
  </body>
</html>`;

export const virtualRouter = async (opts?: Option) => {
    opts ??= {};
    const { glob_opts } = opts;
    let { scanDir, included, excluded, pages } = opts;
    scanDir ??= "src";
    included ??= defaultIncluded;
    excluded ??= defaultExcluded;
    pages ??= defaultPages;

    let root: string, files: string[];
    const input: InputSources = {};

    return [
        {
            name: "vite-virtual-router",
            async config(config, env) {
                config.root = config.root ?? process.cwd();
                root = config.root;

                config.build ??= {};
                config.build.rollupOptions ??= {};
                config.build.rollupOptions.input ??= [];
                const cbro_input = config.build.rollupOptions.input;

                files = await glob(included, {
                    cwd: root,
                    ignore: excluded,
                    nodir: true,
                    ...glob_opts,
                });

                for (let filename of files) {
                    filename = relative(root, filename);
                    filename = filename.replaceAll(/\\/g, "/");
                    
                    const _input= {
                        raw: html,
                        script_src: filename,
                        out: `${filename}/index.html`
                    };

                    let v: ReturnType<InputFunc>;

                    for (const p of pages) {
                        const [g, f] = Object.entries(p)[0];
                        if (micromatch.isMatch(filename, g) && (v = f({ config, env, input, ..._input })) )
                            break;
                    }

                    const out = v ? v.out : _input.out;
                    if (out == null) continue;

                    const virtual = `${PREFIX}${out}`;
                    input[virtual] = v ? v : _input;
                }

                for (const [id, v] of Object.entries(input)) {
                    if (Array.isArray(cbro_input)) cbro_input.push(id);
                        else cbro_input[id] = id;
                }
            },
            resolveId(source, importer, options) {
                return input[source]?.out ?? source;
            },
            load(id, options) {
                const _input = input[`${PREFIX}${id}`];
                let raw = _input?.raw;
                if (!_input) return;
                raw = raw.replaceAll(/%SCRIPT_SRC%/ig, _input.script_src);
                return raw;
            },
        }
    ] as PluginOption;
};