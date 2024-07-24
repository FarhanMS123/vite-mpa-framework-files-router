import { type ReactNode } from 'react'
import type ReactDOM from 'react-dom/client'

/// <reference types="vite/client" />

declare const __TIME__: number;

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