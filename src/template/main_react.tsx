import React from 'react'
import ReactDOM from 'react-dom/client'

/// @ts-expect-error to satisfy vite build
import { createRoot } from 'vite-plugin-virtual-files/src/helper'

/// @ts-expect-error script src would be replaced by virtual
import App from "%SCRIPT_SRC%";

const root = createRoot();

ReactDOM.createRoot(root).render(<App />);