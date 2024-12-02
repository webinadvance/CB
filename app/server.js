import 'dotenv/config'
import express from 'express'
import { handler } from './build/handler.js' // This is the SvelteKit handler
import initializeDatabase from './src/database/index.js'
import addSampleData from './src/database/sampleData.js'
import pagesRouter from './src/api/pages.js'

const app = express()

// API routes should come BEFORE the SvelteKit handler
app.use(express.json())
app.use('/api/pages', pagesRouter)

// SvelteKit handler should be last
app.use(handler)

// Initialize database and start server
async function startServer() {
  await initializeDatabase()
  await addSampleData()

  const port = process.env.PORT || 3000
  app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`),
  )
}

startServer().catch(console.error)
