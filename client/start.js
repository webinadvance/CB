import { handler } from './build/handler.js'
import express from 'express'
import compression from 'compression'

const app = express()
const port = process.env.PORT || 3000

// Add compression middleware
app.use(compression())

// Serve static files
app.use(express.static('build/client'))

// Let SvelteKit handle everything else
app.use(handler)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
