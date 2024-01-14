import { type PluginOption } from 'vite'
import process from "process";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { inspect } from "util";

if (!existsSync("./.inspect.local")) mkdirSync("./.inspect.local");

export const makeCache = (name: string, data: unknown) => writeFileSync(
    `${process.cwd()}/.inspect.local/${new Date().getTime()}_${name}.js`, 
    `(${ inspect(data, true, Infinity, false) })`
);

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