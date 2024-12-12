import { setServerLang } from '$lib/server/lang.js'
import initializeDatabase from '$lib/database/index.js'

let dbInitialized = false

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  try {
    if (!dbInitialized) {
      await initializeDatabase()
      dbInitialized = true
    }

    const urlPath = event.url.pathname

    // Extract language from the route if it exists
    const matchedLang = urlPath.startsWith('/') ? urlPath.split('/')[1] : null
    const supportedLangs = ['en', 'it', 'fr', 'es'] // List of supported languages
    const lang = supportedLangs.includes(matchedLang)
      ? matchedLang
      : event.locals.lang || 'en'

    // Set language only for routes with a valid lang prefix
    if (supportedLangs.includes(matchedLang)) {
      event.locals.lang = lang
      setServerLang(lang)
    }
  } catch (error) {
    console.error('Error in handle hook:', error)
  }

  return resolve(event)
}
