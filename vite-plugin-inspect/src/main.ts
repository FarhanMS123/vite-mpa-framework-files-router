import { ObjectHook as ObjectHook$1 } from 'rollup';
import { type PluginOption, type Plugin } from 'vite';
import { name as pkgName } from "../package.json";

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
        args_plain.map(ienc => 
            typeof ienc == "number" ? params[ienc] :
            Object.assign(
                params[ienc[0]] as object,
                ...ienc.slice(1).filter(k => (k as string)[0] == "!").map(k => ({[`${(k as string).slice(1)}`]: undefined}))
            )
        ),
    )
}

export type ObjectHook = Exclude<ObjectHook$1<false>, false>;

export const flog = (handler: ObjectHook["handler"], order: ObjectHook["order"]) => ({ handler, order } as ObjectHook)

export const default_inspect: PluginOption = [
    {
        name: pkgName,
        configResolved(config) {
            
        },
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