import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer';
import process from 'process';
import App from './App';

// Provide Node.js polyfills required by some libraries (e.g., Twilio deps) when running in the browser
if (typeof window !== 'undefined') {
  // Buffer polyfill
  window.Buffer = window.Buffer || Buffer;
  // process polyfill
  window.process = window.process || process;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
