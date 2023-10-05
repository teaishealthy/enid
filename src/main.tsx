import { createRoot } from 'react-dom/client';

import { ThemeProvider } from './lib/theme-context';

import './styles/index.css';
import './styles/base.css';
import 'cropperjs/dist/cropper.css';

import Router from './router';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <ThemeProvider>
    <Router />
  </ThemeProvider>,
);
