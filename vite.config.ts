import { URL, fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

const CERT_PATH = path.join('/home/hanbiro', 'certs', '192.168.68.82+2.pem')
const KEY_PATH = path.join('/home/hanbiro', 'certs', '192.168.68.82+2-key.pem')

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
    server: {
      host: '0.0.0.0', // cho phép điện thoại / PC khác trong LAN truy cập, không chỉ localhost
      port: 5173,
      https: {
        cert: fs.readFileSync(CERT_PATH),
        key: fs.readFileSync(KEY_PATH),
      },
    },
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
