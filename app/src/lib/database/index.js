import sequelize from '$lib/database/config.js'
import addSampleData from '$lib/database/sampleData.js'
import { Page } from '$lib/database/models/page.js'

async function initializeDatabase() {
  try {
    await sequelize.authenticate()

    // This will create tables only if they don't exist
    await sequelize.sync({ force: false })

    // Check if we need sample data
    const count = await Page.count()
    if (count === 0) {
      await addSampleData()
    }

    return true
  } catch (error) {
    console.error('Database initialization failed:', error)
    return false
  }
}

export default initializeDatabase
