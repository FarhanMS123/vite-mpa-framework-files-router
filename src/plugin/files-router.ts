/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type ConfigEnv, type PluginOption, type UserConfig } from "vite";
import { type GlobOptionsWithFileTypesUnset, glob } from "glob";
import micromatch from "micromatch";
import { relative, join } from "path";
import process from "process";
import { readFileSync } from "fs";
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
    current: InputValue;
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

export const PREFIX = "\0virtual-router-prefix:" as const;
/// @ts-ignore
export const symNull = Symbol(null);
export const html = readFileSync(join(__dirname, "../template/minimal.html")).toString();

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

                files = await glob(included!, {
                    cwd: join(root, scanDir!),
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

                    /**
                     * `current` can use to modify _input without need 
                     * to return, which would continue to execute.
                     * `config` can also be modified by users without
                     * creating new plugins.
                     */

                    let v: ReturnType<InputFunc> = null;
                    for (const p of pages!) {
                        const [g, f] = Object.entries(p)[0];
                        if (micromatch.isMatch(filename, g) && (v = f({ config, env, current: _input, input, ..._input })) )
                            break;
                    }

                    /**
                     * This allow user to set custom key directly, and ask
                     * importer to not storing current file configuration.
                     * ```
                     * input["custom_file_path"] = { out: null }
                     * return input["custom_file_path"];
                     * ```
                     */
                    const out = v ? v.out : _input.out;
                    if (out == null) continue;

                    const virtual = `${PREFIX}${out}`;
                    input[virtual] = v ? v : _input;
                }

                for (const [id, ] of Object.entries(input)) {
                    if (Array.isArray(cbro_input)) cbro_input.push(id);
                        /// @ts-ignore
                        else cbro_input[id] = id;
                }
            },

            /**
             * A literal modules must have no PREFIX on the key
             * and has `null` in the `out`put. As such condition meet,
             * it would going with source.
             */
            resolveId(source, importer, options) {
                return input[source]?.out ?? source;
            },

            /**
             * This only load virtual prefix.
             * After input constructed, user can define new input without prefix
             * and decide `out`put as `null`. This load would not process any key
             * that is not use PREFIX.
             */
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