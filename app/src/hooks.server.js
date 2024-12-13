import { setServerLang } from '$lib/server/lang.js'
import initializeDatabase from '$lib/database/index.js'

// let dbInitialized = false

export async function handle({ event, resolve }) {
  // if (!dbInitialized) {
  //   await initializeDatabase()
  //   dbInitialized = true
  // }
  const pathSegments = event.url.pathname.split('/')
  const lang = ['en', 'it', 'fr', 'es'].includes(pathSegments[1])
    ? pathSegments[1]
    : event.locals.lang || 'en'
  if (lang === pathSegments[1]) {
    event.locals.lang = lang
    setServerLang(lang)
  }
  return resolve(event)
}
