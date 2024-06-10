import { UserConfig, type PluginOption } from 'vite'
import process from "process";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { inspect } from "util";

export const makeCache = (name: string, data: unknown) => {
    if (!existsSync("./.inspect.local")) mkdirSync("./.inspect.local");
    return writeFileSync(
        `${process.cwd()}/.inspect.local/${new Date().getTime()}_${name}.js`, 
        `(${ inspect(data, true, Infinity, false) })`
    )
};

let pos = 1000;

export default function createInspect(order: "post" | "pre") {
    pos += 13; // Math.floor(Math.random() * 999)
    const tag = pos;
    return {
        name: `the_cacher_${order}_${tag}`,
        transformIndexHtml: {
            order,
            handler: (html, ctx) => {
                makeCache(`${tag}_transformIndexHtml_${order}`, {
                    html,
                    ctx
                });
                return html;
            },
        },
        transform: {
            order,
            handler(code, id, options) {
                makeCache(`${tag}_transform_${order}`, {
                    code,
                    id,
                    options
                });
                return {
                    code,
                };
            },
        },
    } as PluginOption;
}

export const showConfig = [{
    name: "vite-show-config",
    config(config, env) {
        const c = {...config, plugins: []} as UserConfig;
        console.log(inspect(c, true, Infinity));
    },
}] as PluginOption;