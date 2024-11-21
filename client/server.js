import 'dotenv/config'
import { handler } from './build/handler.js'
import express from 'express'
import compression from 'compression'

const app = express()
const port = process.env.PORT || 3000

// Add basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})

// Add compression middleware
app.use(compression())

// Serve static files from the client build directory
app.use(express.static('build/client'))

// Let SvelteKit handle everything else
app.use(handler)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
