import { defineConfig } from "vite";
import virtualHtml from 'vite-plugin-virtual-html';

const defa = defineConfig({
    plugins: [
        {
            name: "just-random",
            config(config, env) {
                console.log(config, env);
            },
        },
        virtualHtml({
            pages: {
                "/a/b": {
                    template: "/a/b/c/d.html",
                },
            },
        }),
        {
            name: "just-random-2",
            config(config, env) {
                console.log(config, env);
            },
        },
    ],
});

export default defa;