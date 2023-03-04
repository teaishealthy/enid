import App from './app';
import './main.css';
import { ChakraProvider } from '@chakra-ui/react';
import { type ThemeConfig, extendTheme } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

const config = {
    initialColorMode: 'dark',
};

const theme = extendTheme({
    config,
    colors: {
        gray: {
            750: 'hsl(219deg 24% 18%)',
        },
    },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </React.StrictMode>,
);
