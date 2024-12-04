import sequelize from '$lib/database/config.js'
import addSampleData from '$lib/database/sampleData.js'
import { Page } from '$lib/database/models/page.js'
import { env } from '$env/dynamic/private'

async function initializeDatabase() {
  try {
    await sequelize.authenticate()
    
    // Check if we should force sync (drop and recreate all tables)
    const shouldForceSync = env.DB_FORCE_SYNC === 'true'
    
    // Sync database with force option based on environment variable
    await sequelize.sync({ force: shouldForceSync })

    // If we forced sync or there are no records, add sample data
    const count = await Page.count()
    if (shouldForceSync || count === 0) {
      await addSampleData()
    }

    return true
  } catch (error) {
    console.error('Database initialization failed:', error)
    return false
  }
}

export default initializeDatabase
