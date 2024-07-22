import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from '~/helper'

/// @ts-ignore
import App from "~/src/App";

const root = createRoot();

/// @ts-ignore
ReactDOM.createRoot(root).render(<App />);