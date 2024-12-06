import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default ({ mode }) => {
  const env = loadEnv(mode, resolve(__dirname, '..'));

  return defineConfig({
    server: {
      port: env.VITE_PORT,
      watch: {
        usePolling: true
      },
      proxy: {
        '/api/greeting': {
          target: `${env.VITE_HOST}:${env.VITE_API_PORT}`,
          changeOrigin: true,
          secure: false,
        },
      }
    },
    plugins: [react()],
    define: {
      'process.env': env
    }
  });
}

