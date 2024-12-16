import sequelize from '$lib/database/config.js'
import { Page } from './models/page.js'
import { env } from '$env/dynamic/private'
import addSampleData from './sampleData.js'

async function initializeDatabase() {
  try {
    await sequelize.authenticate()

    const forceSync = env.DB_FORCE_SYNC === 'true'
    if (forceSync) {
      await sequelize.sync({ force: true })
      await addSampleData()
      return true
    }

    await sequelize.sync({ alter: true })
    if ((await Page.count()) === 0) {
      await addSampleData()
    }

    return true
  } catch (error) {
    console.error('Database initialization failed:', error)
    return false
  }
}

export default initializeDatabase
//
