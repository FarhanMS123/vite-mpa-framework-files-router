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
                input: [],
            },
        },
    } as UserConfig));
    
    const output = [];

    for(const config of configs) {
        output.push(await build(config));
    }

    console.log(output);
})();