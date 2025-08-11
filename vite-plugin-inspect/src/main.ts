import { type PluginOption } from 'vite';

export type Plugin$1 = Exclude<NonNullable<Awaited<PluginOption>>, false | PluginOption[]>;
export type ConfigKeys = keyof Plugin$1;

// order, prop, func args, uriencode (for virtual module), non verbose
export default function ViteInspect(opts: Map<ConfigKeys, (null | 'post' | 'pre')[]>, order: undefined | 'pre' | 'post') {
    return [
        {},
    ] as PluginOption;
}