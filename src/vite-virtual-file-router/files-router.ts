/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type ConfigEnv, type PluginOption, type UserConfig } from "vite";

// #region TYPES ##################################################################

export type InputValue = {
    out: string;
    is_virtual?: boolean; // true
    raw: RawFunc;
    labels?: Record<string, unknown> & Partial<{
        __call: number;
        __id: string;
        __options: unknown;
    }>;
    virtuals?: Record<string, string>; // { SCRIPT_SRC: file_relative }
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

// #endregion ##################################################################

export const PREFIX = "\0vvfr-pre:" as const; // vvfr-pre

// #region UTILITIES ##################################################################

export function __prepare_cbro_input(config: UserConfig) {
    config.build ??= {};
    config.build.rollupOptions ??= {};
    config.build.rollupOptions.input ??= [];
    const cbro_input = config.build.rollupOptions.input;
    return cbro_input;
}

export function __push_rollup_input(cbro_input: ReturnType<typeof __prepare_cbro_input>, input: string) {
    if (Array.isArray(cbro_input)) cbro_input.push(input);
        /// @ts-ignore
        else cbro_input[input] = input;
}

// #endregion ##################################################################

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

                const cbro_input = __prepare_cbro_input(config)

                if (typeof _opts == "function") {
                    const __input = input;
                    input = {};
                    opts = await _opts({ __call: ++__call_opts, config, env, input, __input });
                }

                for (let file of opts.files) {
                    file.is_virtual ??= true;
                    const virtual = file.is_virtual ? `${PREFIX}${file.out}` : file.out;
                    input[virtual] = file;
                    __push_rollup_input(cbro_input, virtual);
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
                if (!_input) return;
                _input.labels ??= {};
                _input.labels.__id = id;
                _input.labels.__options = options;
                let raw = await _input?.raw?.({ config, env, current: _input, input });
                if (!raw) return;
                for (const [SCRIPT_SRC, file_relative] of Object.entries(_input.virtuals ?? {})) {
                    raw = raw.replaceAll(RegExp(`%${SCRIPT_SRC}%`, "ig"), file_relative);
                }
                return raw;
            },
        }
    ] as PluginOption;
};