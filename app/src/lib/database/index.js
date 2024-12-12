import sequelize from '$lib/database/config.js'
import { Page } from '$lib/database/models/page.js'
import { env } from '$env/dynamic/private'
import addSampleData from '$lib/database/sampleData.js'

async function initializeDatabase() {
  try {
    await sequelize.authenticate()
    const shouldForceSync = env.DB_FORCE_SYNC === 'true'
    await sequelize.sync({ force: shouldForceSync })
    if (shouldForceSync || (await Page.count()) === 0) await addSampleData()
    return true
  } catch (error) {
    console.error('Database initialization failed:', error)
    return false
  }
}

export default initializeDatabase
