import App from './pages/app';
import './main.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';

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

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ChakraProvider theme={theme}>
        <RecoilRoot>
            <App />
        </RecoilRoot>
    </ChakraProvider>,
);
