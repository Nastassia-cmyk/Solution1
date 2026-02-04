﻿import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from './context/AppContext';
import './main.css';

// Initialize default route
if (!window.location.hash) {
  window.location.hash = '#/tasks';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);
