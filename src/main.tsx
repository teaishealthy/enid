import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { ThemeProvider } from './theme-context';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
