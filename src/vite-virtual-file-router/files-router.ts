/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type ConfigEnv, type PluginOption, type UserConfig } from "vite";

export type InputValue = {
    out: string;
    raw: RawFunc;
    labels?: Record<string, unknown> & Partial<{
        __call: number;
        __id: string;
        __options: unknown;
    }>;
    virtuals: Record<string, string>; // { SCRIPT_SRC: file_relative }
};
export type DebugParams = {
    __call?: number,
    config: UserConfig;
    env: ConfigEnv;
    input: Record<string, InputValue>;
};
export type RawFunc = (params: {
    current: InputValue;
} & DebugParams) => string | undefined | Promise<string | undefined>;
export type InputSources = Record<string, InputValue>; // { id: InputValue }
export type Option = {
    files: InputValue[];
};
export type OptsFunc = (params: {
    __input: Record<string, InputValue>; // previous input
} & DebugParams) => Option | Promise<Option>;

export const PREFIX = "\0vvfr-pre:" as const; // vvfr-pre

export const virtualRouter = async (_opts: Option | OptsFunc) => {
    let opts: Option;
    if (typeof _opts == "function") opts = { files: [] };
    else opts = _opts;

    let __call_opts = -1;
    let config: UserConfig, env: ConfigEnv;
    let input: InputSources = {};

    return [
        {
            name: "vite-virtual-router",
            async config(_config, _env) {
                config = _config;
                env = _env;

                config.build ??= {};
                config.build.rollupOptions ??= {};
                config.build.rollupOptions.input ??= [];
                const cbro_input = config.build.rollupOptions.input;

                if (typeof _opts == "function") {
                    const __input = input;
                    input = {};
                    opts = await _opts({ __call: ++__call_opts, config, env, input, __input });
                }

                for (let filename of opts.files) {
                    const virtual = `${PREFIX}${filename.out}`;
                    input[virtual] = filename;
                    if (Array.isArray(cbro_input)) cbro_input.push(virtual);
                        /// @ts-ignore
                        else cbro_input[id] = id;
                }
            },

            /**
             * A literal modules must have no PREFIX on the key
             * or has `null` in the `out`put. As such condition meet,
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
            async load(id, options) {
                const _input = input[`${PREFIX}${id}`];
                _input.labels ??= {};
                _input.labels.__id = id;
                _input.labels.__options = options;
                let raw = await _input?.raw?.({ config, env, current: _input, input });
                if (!raw) return;
                for (const [SCRIPT_SRC, file_relative] of Object.entries(_input.virtuals)) {
                    raw = raw.replaceAll(RegExp(`%${SCRIPT_SRC}%`, "ig"), `${PREFIX}${file_relative}`);
                }
                return raw;
            },
        }
    ] as PluginOption;
};