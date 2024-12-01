import 'dotenv/config'
import express from 'express'
import initializeDatabase from './database/index.js'
import addSampleData from './database/sampleData.js'
import createViteMiddleware from './config/viteConfig.js'
import pagesRouter from './api/pages.js'
import errorHandler from './middleware/errorHandler.js'

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
