import sequelize from '$lib/database/config.js'
import addSampleData from '$lib/database/sampleData.js'
import { Page } from '$lib/database/models/page.js'

async function initializeDatabase() {
  try {
    console.log('Testing database connection...')
    await sequelize.authenticate()
    console.log('Database connection established.')

    console.log('Checking if tables exist...')
    // First check if the table exists
    const [results] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'Page'
    `)

    if (results.length === 0) {
      console.log('Tables do not exist, creating...')
      // Only create tables if they don't exist
      await sequelize.sync({ force: false })
      console.log('Tables created successfully')

      // Add sample data only for fresh installation
      console.log('Adding sample data for new installation...')
      await addSampleData()
    } else {
      console.log('Tables already exist, skipping initialization')
    }

    return true
  } catch (error) {
    console.error('Database initialization failed:', error)
    return false // Don't throw error, just return false
  }
}

export default initializeDatabase
