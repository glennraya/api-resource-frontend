import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: "app.resources.test",
        port: 4001,
        proxy: {
            "/api": {
                target: "http://api-resource.test",
                changeOrigin: true,
                secure: false,
            },
            "/sanctum": {
                target: "http://api-resource.test",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
