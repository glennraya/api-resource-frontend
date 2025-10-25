import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: "app.resources.test",
        port: 4001,
        allowedHosts: ["api-resource.test", "app.resources.test"],
        proxy: {
            "/api": {
                target: "http://api-resource.test",
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: "app.resources.test",
            },
            "/sanctum": {
                target: "http://api-resource.test",
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: "app.resources.test",
            },
        },
    },
});
