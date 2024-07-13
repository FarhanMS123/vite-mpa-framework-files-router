import React from 'react'

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