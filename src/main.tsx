import React from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeProvider } from './lib/theme-context';
import { BrowserRouter } from 'react-router-dom';

import './styles/index.css';
import './styles/base.css';
import App from './app';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
