import { Page } from './models/page.js'
import samplePages from './data/samplePages.js'

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
