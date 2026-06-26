import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    devtools(),
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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://hanbirosoft.hanbiro.net',
  //       changeOrigin: true,
  //       secure: false,

  //       rewrite: (path) => path.replace(/^\/api/, ''),

  //       configure: (proxy) => {
  //         proxy.on('proxyReq', (proxyReq) => {
  //           proxyReq.setHeader(
  //             'Cookie',
  //             `HANBIRO_GW=4141a9eb09a06ce68be4ee7640b4cec8ef119052b66206dce68b19f0aff9bce63c99fca46a0a7d2b1fa2c0fb916ed81e; hmail_key=8884c26c36e273aca87ae71fcabdce1f; gwsession=a%3A5%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%223f1b08cdc00f500b116c04d0b106949c%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A14%3A%2214.224.229.240%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A115%3A%22Mozilla%2F5.0+%28X11%3B+Linux+x86_64%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F142.0.0.0+Safari%2F537.36+Edg%2F142.0.0.0%22%3Bs%3A13%3A%22last_activity%22%3Bi%3A1777424231%3Bs%3A9%3A%22user_data%22%3Bs%3A0%3A%22%22%3B%7D6d1c589d7343f5e3d41eb5cfdf5b5f958570b984; tab_opening=%5B0.06571613723238034%2C0.7455470534871811%2C0.4565864444783889%2C0.8269593779591674%2C0.5147228076332507%2C0.005896692739857268%2C0.2288922500520404%2C0.6456245484106512%5D`,
  //           )
  //         })
  //       },
  //     },
  //   },
  // },
})
