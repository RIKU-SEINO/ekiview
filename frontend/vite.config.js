import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    server: {
      host: '0.0.0.0',
      port: 3001,
      hmr: {
        host: 'localhost',
        clientPort: '3001'
      },
      proxy: {
        '/api': {
          target: 'http://backend',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      },
    },
    plugins: [
      react()
    ],
    optimizeDeps: {
      include: ['react-zxing'], // react-zxing を依存関係として事前にバンドル
    },
    define: {
      'process.env': env,
    },
  });
};