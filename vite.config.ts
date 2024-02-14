import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import htmlTemplateMPA from 'vite-plugin-html-template-mpa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    htmlTemplateMPA({
      minify: false,
      pagesDir: process.cwd(),
      pages: {
        page1: {
          filename: "test/page1.html",
          template: "src/clean.html",
          inject: {
            data: {
              script_src: "test/main.tsx",
            },
          },
        },
      },
    }),
    splitVendorChunkPlugin(),
    react(),
  ],

  build: {
    rollupOptions: {
      input: {
        page1: "test/page1.html"
      },
      external: /^(.git|.*\.local|dist|node_modules)$/ig,
    },
  },

  root: process.cwd(),
  publicDir: false,
  base: "/",
})
