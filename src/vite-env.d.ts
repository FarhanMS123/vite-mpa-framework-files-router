import { type ReactNode } from 'react'

/// <reference types="vite/client" />

declare const __TIME__: number;

declare global {
    function createRootReact(component: ReactNode): void;
}