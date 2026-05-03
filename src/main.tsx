/// <reference types="vite/client" />
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';
import * as Sentry from "@sentry/react";

window.onerror = function(message, source, lineno, colno, error) {
  document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Runtime Error</h1><pre>${message}</pre></div>`;
};

console.log("Typera: Starting application...");

/*
if (import.meta.env.VITE_SENTRY_DSN) {
  ...
}
*/

console.log("Typera: Mounting React app...");
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Typera: Root element not found!");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log("Typera: React app mounted.");
}
