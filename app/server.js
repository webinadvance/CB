// FILE: client/server.js
import { Sequelize, Model, DataTypes } from 'sequelize'
import express from 'express'
import { createServer } from 'vite'

// Initialize SQLite database
const sequelize = new Sequelize('sqlite::memory:', {
  logging: false,
})

// Define Page model
class Page extends Model {}

Page.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING(200),
    slug: {
      type: DataTypes.STRING(200),
      unique: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    contentData: {
      type: DataTypes.TEXT,
      get() {
        const raw = this.getDataValue('contentData')
        return raw ? JSON.parse(raw) : {}
      },
      set(value) {
        this.setDataValue('contentData', JSON.stringify(value))
      },
    },
    componentName: DataTypes.STRING(100),
    paramSchema: {
      type: DataTypes.TEXT,
      get() {
        const raw = this.getDataValue('paramSchema')
        return raw ? JSON.parse(raw) : []
      },
      set(value) {
        this.setDataValue('paramSchema', JSON.stringify(value))
      },
    },
  },
  {
    sequelize,
    modelName: 'Page',
  },
)

async function createDevServer() {
  const app = express()
  const port = process.env.PORT || 3000

  // Add JSON parsing middleware
  app.use(express.json())

  // API endpoints - defined BEFORE Vite middleware
  app.get('/api/pages', async (req, res) => {
    try {
      const pages = await Page.findAll({
        where: req.query.publishedOnly === 'true' ? { isPublished: true } : {},
      })
      res.json(pages)
    } catch (error) {
      console.error('Error fetching pages:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  app.get('/api/pages/:slug(*)', async (req, res) => {
    try {
      const page = await Page.findOne({
        where: {
          slug: req.params.slug,
          isPublished: true,
        },
      })

      if (!page) return res.status(404).json({ message: 'Page not found' })
      res.json(page)
    } catch (error) {
      console.error('Error fetching page:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  // Create Vite server in middleware mode and use AFTER API routes
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  // Use vite's connect instance as middleware
  app.use(vite.middlewares)

  // Initialize database and start server
  try {
    await sequelize.sync({ force: true })

    // Add sample data
    await Page.bulkCreate([
      {
        title: 'Home',
        slug: 'home',
        contentData: {
          'main-content': { content: 'Welcome' },
          'hero-title': { content: 'Hero Title' },
        },
      },
      {
        title: 'Test',
        slug: 'test',
        componentName: 'TestComponent',
        contentData: {
          'main-content': { content: 'Test content' },
        },
      },
      {
        title: 'Dynamic',
        slug: 'aaa/bbb',
        componentName: 'TestComponent2',
        paramSchema: ['item1', 'item2'],
        contentData: {
          'main-content': { content: 'Dynamic content' },
        },
      },
    ])

    app.listen(port, () => {
      console.log(`Dev server running at http://localhost:${port}`)
      console.log(`API available at http://localhost:${port}/api/pages`)
    })
  } catch (error) {
    console.error('Unable to start server:', error)
    process.exit(1)
  }
}

createDevServer()
