import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import virtualHtml from 'vite-plugin-virtual-html';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    virtualHtml({
      pages: {
        "dist/test/hello.tsx": {
          template: "/src/clean.html",
          data: {
            script_src: "/test/main.tsx"
          },
        },
      },
    }),
    splitVendorChunkPlugin(),
    react(),
  ],

  build: {
    rollupOptions: {
      external: /^(.git|.*\.local|dist|node_modules)$/ig,
    },
  },

  root: process.cwd(),
  publicDir: false,
  base: "/",
})
