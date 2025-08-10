/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ViteDevServer, type ConfigEnv, type PluginOption, type UserConfig } from "vite";
import path from "node:path";
import resolve from "resolve";

export type InputValue_Virtual = {
    out: string;
    raw: RawFunc;
    isRollupInput?: false;
    basedir?: string;
    labels?: Record<string, unknown> & Partial<{
        __call: number;
        __id: string;
        __options: unknown;
    }>;
    virtuals?: Record<string, string | undefined>; // { SCRIPT_SRC: file_relative }
};
export type InputValue = InputValue_Virtual;


export type InputSources = Record<string, InputValue>; // { id: InputValue }
export type Option = {
    files: InputValue[];
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
export type OptsFunc = (params: {
    __input: Record<string, InputValue>; // previous input
} & DebugParams) => Option | Promise<Option>;

// #endregion ##################################################################

export const PREFIX = "vvfr-pre:" as const; // vvfr-pre
export const PREFIX_X00 = `\0${PREFIX}` as const; // vvfr-pre

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
    let server: ViteDevServer;

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

                for (const file of opts.files) {
                    const virtual = `${PREFIX_X00}${file.out}`;
                    input[virtual] = file;
                    if(file.isRollupInput != false) __push_rollup_input(cbro_input, virtual);
                }
            },

            configResolved(_config) {
                Object.assign(config, _config);
                console.log(config.build?.rollupOptions?.input);
            },

            /**
             * A literal modules must have no PREFIX on the key
             * or has `null` in the `out`put. As such condition meet,
             * it would going with source.
             * This plugin would insert virtual file name such `\x00virtual-prefix:out-file`
             * or something plugin defined into `config.build.rollupOptions.input`.
             * This self defined file name also stored as key and for
             * identification. As such, this resolveId would need to 
             * find `${source}` for virtual index, xor `\0${source}` 
             * for virtual module that come from script `src` or module `import`
             * inside a file (of course, file cannot has `\0`).
             * 
             * we should agree that source would come directly from input which has PREFIX_X00
             * or come from a file that src to virtual which have no \x00 in it.
             * So it rather has: `\0vvfr-pre:` or `vvfr-pre:`. As importer has been
             * resolved there is no prefix on it, we need to concat the prefix by
             * ourself. This case on importing relative physical module from 
             * virtual module.
             */
            async resolveId(source, importer, options) {
                // TODO: why I need to check both condition? Would ever source and importer is begin by '\0'?
                // TODO: does this order of `if` is right? Seems wrong.
                // NOTE: importer should have no prefix right? straight to filename

                console.log("resolveId", encodeURIComponent(source), encodeURIComponent(String(importer)));

                if (source in input || `\0${source}` in input) {
                    const virtual = input[source] ?? input[`\0${source}`];
                    return virtual.out ?? undefined;
                } else if (`${PREFIX}${importer}` in input || `${PREFIX_X00}${importer}` in input) { // this is for there is virtual module importing relative path
                    const virtual = input[`${PREFIX}${importer}`] ?? input[`${PREFIX_X00}${importer}`];
                    const imported = resolve.sync(source, {
                        basedir: virtual.basedir,
                        extensions: [path.extname(importer!), '.tsx', '.ts', '.jsx', '.mjs', '.js'],
                    });
                    return imported;
                }
            },

            /**
             * This only load virtual prefix.
             * After input constructed, user can define new input without prefix
             * and decide `out`put as `null`. This load would not process any key
             * that is not use PREFIX. We must agree that id is everything that 
             * has been resolved and is a path with no prefix.
             * All resolved Id would be in the form of file path with no prefix.
             * As such, it need to compare the id with combined prefix. This load
             * only need to find all virtuals and matching its metadata.
             */
            async load(id, options) {
                console.log("load", encodeURIComponent(id), options);

                const _input = input[`${PREFIX_X00}${id}`] as InputValue_Virtual;
                if (!_input) return;

                _input.labels ??= {};
                _input.labels.__id = id;
                _input.labels.__options = options;

                let raw = await _input?.raw?.({ config, env, current: _input, input });
                if (!raw) return;
                
                // virtual module need a prefix but without `\0`
                for (const [SCRIPT_SRC, file_relative] of Object.entries(_input.virtuals ?? {}))
                    if (file_relative)
                        raw = raw.replaceAll(RegExp(`%${SCRIPT_SRC}%`, "g"), `${PREFIX}${file_relative}`);

                for (const [key, val] of Object.entries({ ...config.define, ..._input.labels }))
                    // typeof val != "object" && typeof val != "function
                    // should only string, but how about symbols and undefined?
                    if (val && typeof val != "object" && typeof val != "function")
                        raw = raw.replaceAll(RegExp(`%${key}%`, "g"), val.toString());

                return raw;
            },
            configureServer: {
                handler: function (_server) {
                    server = _server;
                    /// @ts-expect-error debug mode, let server be global
                    global.server = server;
                    server.middlewares.use(`/@id`, async function(req, res, next){
                        const resUrl = req.originalUrl!.split('?')[0];

                        if (resUrl.startsWith(`/@id/__x00__${PREFIX}`) && resUrl.endsWith(".html")) {
                            const moduleId = resUrl.slice('/@id/__x00__'.length);
                            try {
                                const resId = (await server.pluginContainer.resolveId(moduleId))!.id;
                                const _raw = (await server.pluginContainer.load(resId));
                                
                                /// @ts-expect-error code is exists;
                                let raw: string = _raw?.code ?? _raw;
                                raw = raw.replaceAll(PREFIX, `/@id/__x00__${PREFIX}`);

                                const htmlRaw = await server.transformIndexHtml(`/@id/__x00__${PREFIX}`, raw);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'text/html');
                                res.end(htmlRaw);

                                console.log(htmlRaw);

                                return;
                            } catch (e) {
                                return next();
                            }
                        }
                    });
                }
            },
        }
    ] as PluginOption;
};
