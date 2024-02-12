import { type ReactNode } from 'react'
import ReactDOM from 'react-dom/client'

export default ReactDOM;

export function createRootReact(component: ReactNode) {
    let root = document.getElementById("root")!;

    if (!root) {
        root = document.createElement("div");
        root.id = "root";
        document.append(root);
    }

    return ReactDOM.createRoot(root).render(component);
}

Object.assign(window, { ReactDOM, createRootReact });