import { defineConfig } from "vite";
import virtualHtml from 'vite-plugin-virtual-html';

const defa = defineConfig({
    plugins: [
        {
            name: "just-random",
            options(options) {
                console.log("options", options);
            },
            buildStart(options) {
                console.log("buildStart", options);
            },
            resolveId(source, importer, options) {
                console.log("resolveId", source, importer, options);
            },
            load(id, options) {
                console.log("load", id, options);
            },

            transform(code, id, options) {
                console.log("transform");
            },
            transformIndexHtml: {
                order: "pre",
                handler: (html, ctx) => {
                    console.log("transformIndexHtml-pre");
                }
            },
        },
    ],
    build: {
        rollupOptions: {
            input: {
                // "/not/exist/a": "not/exist/a.html",
                // "/some/exist": "src/index.html",
            },
        },
    },
});

export default defa;