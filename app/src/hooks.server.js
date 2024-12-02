// src/hooks.server.js
import initializeDatabase from '$lib/database/index.js'
import addSampleData from '$lib/database/sampleData.js'

let dbInitialized = false

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  try {
    if (!dbInitialized) {
      await initializeDatabase()
      await addSampleData()
      dbInitialized = true
    }
  } catch (error) {
    console.error('Database initialization error:', error)
    // Continue even if DB init fails - might be duplicate data
  }

  return resolve(event)
}
