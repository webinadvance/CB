import { sequelize } from './models/page.js'

async function initializeDatabase() {
  try {
    await sequelize.sync({ force: true })
    console.log('Database synced successfully')
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}

export default initializeDatabase
