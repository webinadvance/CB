import { Page } from '$lib/database/models/page.js'
import samplePages from '$lib/database/data/samplePages.js'

async function addSampleData() {
  try {
    await Page.bulkCreate(samplePages)
    console.log('Sample data added successfully')
  } catch (error) {
    console.error('Failed to add sample data:', error)
    throw error
  }
}

export default addSampleData
