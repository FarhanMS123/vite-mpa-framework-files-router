import defaultConfig from "vite.config";
import { generateRoutesConfig } from "src/plugin/files-router";
import { UserConfig, build, mergeConfig } from "vite";

(async () => {
    const configs = (await generateRoutesConfig({
        config: defaultConfig,
    }))
        .map(c => mergeConfig(defaultConfig, c));

    configs.push(mergeConfig(defaultConfig, {
        build: {
            rollupOptions: {
                input: {},
            },
        },
    } as UserConfig));

    for(const config of [configs[configs.length - 1]]) {
        const output = await build(config);
        console.log(output);
    }
})();