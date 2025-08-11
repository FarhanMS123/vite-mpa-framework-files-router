import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from "vite-plugin-virtual-files/dist/template/helper"

import Abc from "./page-name-3.companion";

// using helper and direct src

export function Second() {
  return (
    <React.StrictMode>
      <span>This is an element come from page-name which is transformed.</span>
      <Abc />
    </React.StrictMode>
  );
}

const root = createRoot();

ReactDOM.createRoot(root).render(<Second />);