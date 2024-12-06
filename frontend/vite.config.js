import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  //port番号を.envファイルから取得
  server: {
    host: "0.0.0.0",
    port: process.env.FRONTEND_PORT,
    watch: {
      usePolling: true
    },
  },
  plugins: [react()]
});

