import ReactDOM from 'react-dom/client'
import { createRoot } from './helper'

/// @ts-ignore
import App from "%SCRIPT_SRC%";

const root = createRoot();

/// @ts-ignore
ReactDOM.createRoot(root).render(<App />);