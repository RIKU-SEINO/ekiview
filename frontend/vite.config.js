import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    server: {
      host: env.VITE_HOST,
      port: env.VITE_PORT,
      watch: {
        usePolling: true
      },
      proxy: {
        '/api/greeting': {
          target: `http://${env.VITE_HOST}:${env.VITE_API_PORT}`,
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

