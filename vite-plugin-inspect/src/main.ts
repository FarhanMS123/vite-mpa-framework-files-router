import { ObjectHook as ObjectHook$1 } from 'rollup';
import { type PluginOption, type Plugin } from 'vite';

export function log(name: string, args_encc: number[], args_plain: number[]) {
    return (...params: unknown[]) => console.log(
        name,
        args_encc.map(ienc => encodeURIComponent(String(params[ienc]))),
        args_plain.map(ienc => params[ienc]),
    )
}

export type ObjectHook = Exclude<ObjectHook$1<false>, false>;

export const flog = (handler: ObjectHook["handler"], order: ObjectHook["order"]) => ({ handler, order } as ObjectHook)

// order, prop, func args, uriencode (for virtual module), non verbose
export default function ViteInspect(opts: {
    [k in keyof Plugin]: Plugin["apply"]
}) {
    return [
        {},
    ] as PluginOption;
}