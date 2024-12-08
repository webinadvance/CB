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

    const lang = event.params.lang || 'en'
    event.locals.lang = lang
    setServerLang(lang)
  } catch (error) {
    console.error('Database initialization error:', error)
  }

  return resolve(event)
}
