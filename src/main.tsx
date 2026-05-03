import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';

console.log('Typera: Entry point reached');

const container = document.getElementById('root');

if (!container) {
  console.error('Typera: Root element #root not found');
} else {
  try {
    console.log('Typera: Initializing React root');
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('Typera: Render call completed');
  } catch (error) {
    console.error('Typera: Critical error during render', error);
    container.innerHTML = `<div style="background:white; color:black; padding:20px;"><h1>Render Error</h1><pre>${error}</pre></div>`;
  }
}
