import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { ViteEjsPlugin } from 'vite-plugin-ejs';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  return defineConfig({
    base: process.env.VITE_APP_BASE_PATH,
    plugins: [react(), tsconfigPaths(), ViteEjsPlugin()],
    root: resolve(process.cwd(), 'dev'),
    publicDir: resolve(process.cwd(), 'public'),
    envDir: process.cwd(),
    build: {
      outDir: resolve(process.cwd(), 'dist'),
    },
    server: {
      proxy: {
        '/bpmn-api': {
          target: process.env.DEV_API_PROXY_TARGET,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/bpmn-api/, ''),
          headers: {
            'remote-user': process.env.DEV_API_PROXY_USER_HEADER || '',
            'remote-user-groups': process.env.DEV_API_PROXY_USER_GROUPS || '',
          },
        },
      },
    },
  });
};
