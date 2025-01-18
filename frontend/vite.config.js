import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: {
      host: true,
      port: process.env.VITE_APP_PORT,
      hmr: {
        host: process.env.VITE_APP_HOST,
        clientPort: process.env.VITE_APP_PORT,
      },
    },
    plugins: [
      react()
    ],
    optimizeDeps: {
      include: ['react-zxing'],
    },
    define: {
      '__VITE_API_BASE_URL__': JSON.stringify(process.env.VITE_API_BASE_URL),
    },
  });
};