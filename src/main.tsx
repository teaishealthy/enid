import React from 'react';
import ReactDOM from 'react-dom';

import { ThemeProvider } from './lib/theme-context';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
