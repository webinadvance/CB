import { sequelize } from './models/page.js'

async function initializeDatabase() {
  try {
    await sequelize.sync() // Avoid `force: true` in production
    console.log('Database synced successfully')
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}

export default initializeDatabase
