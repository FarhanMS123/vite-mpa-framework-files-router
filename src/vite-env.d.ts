import type { ReactNode } from 'react'
import type ReactDOM from 'react-dom/client'

/// <reference types="vite/client" />

// https://vitejs.dev/config/shared-options.html#define
// https://esbuild.github.io/api/#define
declare const __TIME__: number;

// https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
interface ImportMetaEnv {
    // readonly VITE_APP_TITLE: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module NodeJS {
    interface Global {
        // 
    }
}

declare global {
    interface Window {
        // createRootReact: (component: ReactNode) => void;
        // createAppVue: (component: ReactNode) => void;
        // ReactDOM: typeof ReactDOM;
    }
}