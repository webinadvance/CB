import { createServer } from 'vite'

async function createViteMiddleware() {
  try {
    const vite = await createServer({
      server: { middlewareMode: 'true' },
      appType: 'custom',
    })
    console.log('Vite middleware initialized successfully')
    return vite.middlewares
  } catch (error) {
    console.error('Failed to initialize Vite middleware:', error)
    throw error
  }
}

export default createViteMiddleware
