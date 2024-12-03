import sequelize from '$lib/database/config.js'
import addSampleData from '$lib/database/sampleData.js'
import { Page } from '$lib/database/models/page.js'

async function initializeDatabase() {
  try {
    console.log('Testing database connection...')
    await sequelize.authenticate()
    console.log('Database connection established.')

    console.log('Checking database tables...')
    // Change force: true to alter: true to preserve existing tables and data
    await sequelize.sync({ alter: true })
    console.log('Database tables verified.')

    // Only add sample data if table is empty
    const count = await Page.count()
    if (count === 0) {
      console.log('Database empty, adding sample data...')
      await addSampleData()
    } else {
      console.log(
        `Database already contains ${count} pages, skipping sample data.`,
      )
    }

    return true
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}
export default initializeDatabase
