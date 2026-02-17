import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    server: {
        host: "::",
        port: 8080,
        hmr: {
            overlay: false,
        },
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5000', // Your Flask server URL
                changeOrigin: true,
                secure: false,
                // Add these lines to prevent the "Socket Hang Up"
                timeout: 120000,         // Wait 120 seconds for the response
                proxyTimeout: 120000,    // Wait 120 seconds for the connection
            }
        }
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
}));
