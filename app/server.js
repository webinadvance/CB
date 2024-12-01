import express from 'express'
import { createServer } from 'vite'
import { sequelize, Page } from './database/models/page.js'
import pagesRouter from './api/pages.js'

async function createDevServer() {
  const app = express()
  const port = process.env.PORT || 3000

  app.use(express.json())

  // API routes
  app.use('/api/pages', pagesRouter)

  // Vite middleware
  const vite = await createServer({
    server: { middlewareMode: 'true' },
    appType: 'custom',
  })

  app.use(vite.middlewares)

  // Initialize database and start server
  try {
    await sequelize.sync({ force: true })

    // Sample data
    await Page.bulkCreate([
      {
        title: 'Home',
        slug: 'home',
        contentData: { 'main-content': { content: 'Welcome' } },
      },
      {
        title: 'Test',
        slug: 'test',
        componentName: 'TestComponent',
        contentData: { 'main-content': { content: 'Test content' } },
      },
      {
        title: 'Dynamic',
        slug: 'aaa/bbb',
        componentName: 'TestComponent2',
        paramSchema: ['item1', 'item2'],
        contentData: { 'main-content': { content: 'Dynamic content' } },
      },
    ])

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Unable to start server:', error)
    process.exit(1)
  }
}

createDevServer()
