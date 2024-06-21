import { createApp } from 'vue';
import { createRoot } from 'vite-virtual-file-router/template/helper'

/// @ts-ignore
import App from '%SCRIPT_SRC%';

const root = createRoot();

createApp(App).mount(root);