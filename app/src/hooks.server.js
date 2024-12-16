import { setServerLang } from '$lib/server/lang.js'
import initializeDatabase from '$lib/database/index.js'
import { handle as authHandle } from './lib/auth/config.js'

let dbInitialized = false

export async function handle({ event, resolve }) {
  // Initialize the database (run once)
  if (!dbInitialized) {
    await initializeDatabase()
    dbInitialized = true
  }

  // Extract and set the language
  const pathSegments = event.url.pathname.split('/')
  const lang = ['en', 'it', 'fr', 'es'].includes(pathSegments[1])
    ? pathSegments[1]
    : event.locals.lang || 'en'

  if (lang === pathSegments[1]) {
    event.locals.lang = lang
    setServerLang(lang)
  }

  // Delegate to the Auth handler
  return authHandle({ event, resolve })
}
