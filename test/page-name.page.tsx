import React from 'react'
import ReactDOM from 'react-dom/client'

export default function App() {
  return (<React.StrictMode>
    This is App on page-name which is transformed.
  </React.StrictMode>);
}

export function Second() {
  return (
    <React.StrictMode>
      <span>This is an element come from page-name which is transformed.</span>
    </React.StrictMode>
  );
}

let root = document.getElementById("root")!;

if (!root) {
  root = document.createElement("div");
  root.id = "root";
  document.body.append(root);
}

ReactDOM.createRoot(root).render(<App />);