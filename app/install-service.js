import { Service } from 'node-windows'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const svc = new Service({
  name: 'SvelteKit-App',
  description: 'SvelteKit Web Application',
  script: join(__dirname, 'server.js'),
  env: {
    name: 'NODE_ENV',
    value: 'production',
  },
})

svc.on('install', () => {
  svc.start()
  console.log('Service installed and started successfully')
})

// Install the service
svc.install()
