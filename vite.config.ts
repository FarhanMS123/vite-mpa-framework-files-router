import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from "fs/promises";

// https://vitejs.dev/config/
export default defineConfig(async () => {
  await fs.mkdir("./node_modules/.cache.vite-virtual", {
    recursive: true,
  });
  await fs.copyFile("./sample.html", "./node_modules/.cache.vite-virtual/sample.html");

  return {
    build: {
      rollupOptions: {
        input: {
          "home/app.html": "./sample.html",
          "base.html": "./node_modules/.cache.vite-virtual/sample.html",
        },
      }
    },
    plugins: [react()],
  };
})
