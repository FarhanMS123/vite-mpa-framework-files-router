import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "",
      
    },
    tsconfigPaths(),
    react(),
  ],
  build: {
    rollupOptions: {
      input: [
        "\0virtual:src/minimal.html",
        "\0virtual:src/main_react.tsx",
      ],
    },
  },
})
