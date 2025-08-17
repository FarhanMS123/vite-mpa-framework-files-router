import { name as _pkgName } from "../package.json";
import { type PluginOption, type ViteDevServer } from 'vite';
// getServer, watchHotReload, reload

const pkgName = _pkgName.split("/").slice(-1)[0]!;

let server: ViteDevServer;

export const getServer = () => server;

export function prepareHTML () {};
export function prepareJS () {
    // import, require
};

export default function VirtualServer(prefix: string[], pattern: string, index: string[]) {
    return [
        {
            name: pkgName,
            configureServer: {
                handler: function (_server) {
                    server = _server;
                    // /// @ts-expect-error debug mode, let server be global
                    // global.server = server;
                    server.middlewares.use(`/@id`, async function(req, res, next){
                        const resUrl = req.originalUrl!.split('?')[0]!;
                        if (!resUrl.startsWith(`/@id/__x00__`)) return next();

                        const moduleId = resUrl.slice('/@id/__x00__'.length);
                        try {
                            //
                        } catch (e) {
                            return next();
                        }
                    });
                }
            },
        }
    ] as PluginOption;
}