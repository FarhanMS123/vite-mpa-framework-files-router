import ReactDOM from 'react-dom/client'
import { createRoot } from 'vite-virtual-file-router/template/helper'

/// @ts-ignore
import App from "%SCRIPT_SRC%";

const root = createRoot();

/// @ts-ignore
ReactDOM.createRoot(root).render(<App />);