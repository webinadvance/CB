import express from 'express'
import initializeDatabase from './database/index.js'
import addSampleData from './database/sampleData.js'
import createViteMiddleware from './config/viteConfig.js'
import pagesRouter from './api/pages.js'

async function createDevServer() {
  const app = express()
  const port = process.env.PORT || 3000

  app.use(express.json())

  // API routes
  app.use('/api/pages', pagesRouter)

  // Vite middleware
  try {
    const viteMiddleware = await createViteMiddleware()
    app.use(viteMiddleware)
  } catch (error) {
    console.error('Unable to setup Vite middleware:', error)
    process.exit(1)
  }

  // Database initialization and sample data
  try {
    await initializeDatabase()
    await addSampleData()
  } catch (error) {
    console.error('Failed to initialize database or add sample data:', error)
    process.exit(1)
  }

  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

createDevServer()
