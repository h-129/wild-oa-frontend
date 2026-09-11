import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {fileURLToPath, URL} from "node:url";
import WindiCSS from 'vite-plugin-windicss'
// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), WindiCSS(),],
    server: {
        host: "0.0.0.0",
        port: 3270,
        open: true,
        proxy: {
            "/api": {
                target: "http://localhost:8263/api",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
    // 路径别名
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
