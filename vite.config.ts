import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log('mode', mode)
  return {
    plugins: [
      devtools(),
      // VitePWA({
      //   disable: mode !== 'production',
      //   registerType: 'autoUpdate',
      //   injectRegister: 'auto',
      // }),
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: 'src/routes',
        generatedRouteTree: 'src/shared/router/routeTree.gen.ts',
      }),
      viteReact(),
      svgr({
        svgrOptions: {
          icon: true,
        },
      }),
    ],
    optimizeDeps: {
      include: ['lucide-react'], // Ép Vite gom tất cả icon vào 1 chunk duy nhất trong dev
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      },
    },
  }
})
