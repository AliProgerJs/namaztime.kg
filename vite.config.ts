import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // при необходимости прокси к API:
    // proxy: { "/muftiyat": { target: "https://muftiyat.kg", changeOrigin: true } }
  },
});
