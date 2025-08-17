import { ObjectHook as ObjectHook$1 } from 'rollup';
import { type PluginOption, type Plugin } from 'vite';
import { name as _pkgName } from "../package.json";

const pkgName = _pkgName.split("/").slice(-1)[0]!;

export type simpleObject = {[k: string]: unknown};

export function rebuildJson(obj: simpleObject, excludes: string[], onlys?: string[]) {
    obj = (onlys && onlys.length) ? {} : Object.assign({}, obj);

    for (const k in onlys) {}
}

export function log(
    name: string, 
    args_encc: number[], 
    args_plain: (
        number | 
        [number, ...(`!${string}` | `*${string}`)[]]    // : *only | !exclude
    )[] = []
) {
    return (...params: unknown[]) => console.log(
        name,
        args_encc.map(ienc => encodeURIComponent(String(params[ienc]))),
        args_plain.map(ienc => {
            if (typeof ienc == "number") return params[ienc];
            const only: simpleObject = {};
            const exclude: string[] = [];

            for (const k in ienc.slice(1)) 
                if ((k as string)[0] == "*") {
                    only[k.slice(1)] = (params[ienc[0]] as simpleObject)[k.slice(1)];
                } else {
                    exclude.push(k);
                }
            

            Object.assign(
                params[ienc[0]] as object,
                ...exclude.map(k => ({[`${(k as string).slice(1)}`]: undefined}))
            )
        }),
    )
}

export type ObjectHook = Exclude<ObjectHook$1<false>, false>;

export const flog = (handler: ObjectHook["handler"], order: ObjectHook["order"]) => ({ handler, order } as ObjectHook)

export const default_inspect: PluginOption = [
    {
        name: pkgName,
        configResolved: log(`${pkgName}:resolveId`, [], [[0, "!plugins"]]),
        resolveId: log(`${pkgName}:resolveId`, [0], [1]), // source, importer, options
        load: log(`${pkgName}:load`, [0]) // id, options
    }
];

// order, prop, func args, uriencode (for virtual module), non verbose
export default function ViteInspect(opts: {
    [k in keyof Plugin]: Plugin["apply"]
}) {
    return [
        {},
    ] as PluginOption;
}