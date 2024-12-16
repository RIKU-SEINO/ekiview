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
    plugins: [react()],
    define: {
      'process.env': env,
    },
  });
};
