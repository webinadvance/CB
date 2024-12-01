import 'dotenv/config'
import express from 'express'
import initializeDatabase from './src/database/index.js'
import addSampleData from './src/database/sampleData.js'
import createViteMiddleware from './src/config/viteConfig.js'
import pagesRouter from './src/api/pages.js'
import errorHandler from './src/middleware/errorHandler.js'

const app = express()
app.use(express.json())
app.use('/api/pages', pagesRouter)
app.use(errorHandler)
app.use(await createViteMiddleware())
await initializeDatabase()
await addSampleData()

const port = process.env.PORT
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`),
)
