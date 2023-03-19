import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA }from 'vite-plugin-pwa'
import Manifest from "./manifest.json"



// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA({
        manifest: Manifest,
        workbox: {
            globPatterns: [
                '**/*.{js,css,html,png,jpg,jpeg,gif,svg,ico,webp,webmanifest}'
            ],
        }
    })],
});
