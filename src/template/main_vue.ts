import { createApp } from 'vue';
import { createRoot } from './helper'

/// @ts-expect-error this is template to fill
import App from '%SCRIPT_SRC%';

const root = createRoot();

createApp(App).mount(root);