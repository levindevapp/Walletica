import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { getRequestListener } from '@hono/node-server'
import type { Plugin } from 'vite'
import { app } from './server/index.js'
import { initializeDatabase } from './server/db/initialize.js'

function honoApiPlugin(): Plugin {
  const requestListener = getRequestListener(app.fetch)

  return {
    name: 'walletica-hono-api',
    enforce: 'pre',
    configureServer(server) {
      initializeDatabase()
      server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith('/api')) {
          next()
          return
        }
        void requestListener(request, response)
      })
    },
  }
}

export default defineConfig({
  plugins: [honoApiPlugin(), react(), tailwindcss()],
})
