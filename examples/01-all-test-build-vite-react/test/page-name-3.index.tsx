import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from "vite-plugin-virtual-files/dist/template/helper"

// using helper and direct src

export function Second() {
  return (
    <React.StrictMode>
      <span>This is an element come from page-name which is transformed.</span>
    </React.StrictMode>
  );
}

const root = createRoot();

ReactDOM.createRoot(root).render(<Second />);