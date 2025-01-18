import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    server: {
      host: true,
      port: env.VITE_APP_PORT,
      hmr: {
        host: env.VITE_APP_HOST,
        clientPort: env.VITE_APP_PORT,
      },
    },
    plugins: [react()],
    optimizeDeps: {
      include: ['react-zxing'],
    },
    define: {
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL) || 'https://ekiview-backend.onrender.com'
    },
  };
});