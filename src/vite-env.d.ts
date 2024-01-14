import { type ReactNode } from 'react'

/// <reference types="vite/client" />

declare global {
    function createRoot(component: ReactNode): void;
}