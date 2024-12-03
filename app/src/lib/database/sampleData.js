import samplePages from '$lib/database/data/samplePages.js'
import { Page } from '$lib/database/models/page.js'

async function addSampleData() {
  try {
    for (const page of samplePages) {
      await Page.create({ ...page, isPublished: true })
      console.log(`Added page: ${page.title}`)
    }
    console.log(`Total pages in database: ${await Page.count()}`)
  } catch (error) {
    console.error('Failed to add sample data:', error.message)
    if (error.original) console.error('SQL Error:', error.original)
    throw error
  }
}

export default addSampleData
