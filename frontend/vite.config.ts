import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['web-ifc-three', 'web-ifc']
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'configure-wasm-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.endsWith('.wasm')) {
            res.setHeader('Content-Type', 'application/wasm')
          }
          next()
        })
      }
    },
  ],
  server: {
    fs: {
      allow: ['..']
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames:'assets/[name]-[hash][extname]'
        }
      }
    }
  })
