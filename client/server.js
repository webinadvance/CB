import 'dotenv/config'
import { handler } from './build/handler.js' // SvelteKit handler
import express from 'express'
import compression from 'compression'
import cors from 'cors'
import { router as pagesRouter } from './server/routes/pages.js' // Import your API routes
import { initializeDatabase } from './server/database/init.js' // Database initialization
import { sequelize } from './server/database/config.js' // Sequelize instance

const app = express()
const port = process.env.PORT || 3000

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})

// Compression middleware
app.use(compression())

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

// JSON body parser middleware
app.use(express.json())

// Serve static files from the client build directory
app.use(express.static('build/client'))

// Custom API routes
app.use('/api', pagesRouter)

// Let SvelteKit handle everything else
app.use(handler)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')

    // Initialize database and seed data
    await initializeDatabase()
    console.log('Database initialized successfully')

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Unable to start server:', error)
    process.exit(1) // Exit if server fails to start
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error)
  process.exit(1)
})

// Start the server
startServer()
