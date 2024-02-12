import { type PluginOption, type UserConfig } from "vite";

export type RollupConfig2 = UserConfig["build"]["rollupOptions"] | RollupConfig2[];
export type UserConfig2 = (Omit<UserConfig, "build" | "plugins"> & {
    // ! this is difficult to override just to replace UserConfig to be UserConfig2.
    // plugins?: (Omit<PluginOption, "config"> & {
    //     config: any;
    // })[];
    build?: Omit<UserConfig["build"], "rollupOptions"> & {
        rollupOptions?: RollupConfig2;
    };
}) | UserConfig2[];

// 1. split array of rollupOptions to different Vite Configuration
// 2. Set public at the end of configuration
// 3. turnoff all public in each vite configuration
// 4. Split Vite Config

// export async function builder(props: UserConfig2) {}

export async function builder(props: UserConfig[]) {}