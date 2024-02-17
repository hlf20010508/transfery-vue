import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: './',
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_PROXY_HOSTNAME,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        '/socket.io': {
          target: env.VITE_PROXY_HOSTNAME,
          ws: true,
          changeOrigin: true
        }
      },
      host: '0.0.0.0',
      port: 8080,
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'static/index.js',
          assetFileNames: 'static/[name][extname]',
          chunkFileNames: 'static/[name].js'
        },
      },
    },
    esbuild: {
      pure: ['console.log'],
      drop: ['debugger'],
    },
  }
})
