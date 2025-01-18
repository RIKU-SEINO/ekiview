import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import replace from '@rollup/plugin-replace';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  console.log('VITE_API_BASE_URL:', env.VITE_API_BASE_URL);
  return {
    server: {
      host: true,
      port: env.VITE_APP_PORT,
      hmr: {
        host: env.VITE_APP_HOST,
        clientPort: env.VITE_APP_PORT,
      },
    },
    plugins: [
      react(),
      replace({
        'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      }),
    ],
    optimizeDeps: {
      include: ['react-zxing'],
    },
  };
});