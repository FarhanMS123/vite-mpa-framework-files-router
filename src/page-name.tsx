import React from 'react'
import ReactDOM from 'react-dom/client'

let root = document.getElementById("root")!;

if (!root) {
  root = document.createElement("div");
  root.id = "root";
  document.append(root);
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <span>This is an element come from page-name which is transformed.</span>
  </React.StrictMode>,
)

export default function App() {
  return (<>This is App on page-name which is transformed</>);
}

export function Second() {
  return (
    <React.StrictMode>
      <span>This is an element come from page-name which is transformed.</span>
    </React.StrictMode>
  );
}