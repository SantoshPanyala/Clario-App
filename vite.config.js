import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

// This is the final, clean config for production.
export default defineConfig({
    plugins: [
        react()
    ],
    resolve: {
        alias: {
            "@": path.resolve(process.cwd(), "src"),
        },
    },
});