import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import ImportMetaEnvPlugin from "@import-meta-env/unplugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ImportMetaEnvPlugin.vite({
      example: ".env.example",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
