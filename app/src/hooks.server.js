import initializeDatabase from '$lib/database/index.js'

let dbInitialized = false

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  try {
    if (!dbInitialized) {
      await initializeDatabase()
      dbInitialized = true
    }
  } catch (error) {
    console.error('Database initialization error:', error)
  }

  return resolve(event)
}
