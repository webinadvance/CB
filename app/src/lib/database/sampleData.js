import samplePages from '$lib/database/data/samplePages.js'
import { Page } from '$lib/database/models/page.js'

async function addSampleData() {
  try {
    console.log('Adding sample data...')

    // Try each record individually to better handle errors
    for (const page of samplePages) {
      await Page.create({
        ...page,
        isPublished: true,
      })
      console.log(`Added page: ${page.title}`)
    }

    // Verify the data
    const count = await Page.count()
    console.log(`Total pages in database: ${count}`)

    console.log('Sample data added successfully')
  } catch (error) {
    console.error('Failed to add sample data:', error.message)
    // Log the specific error details
    if (error.original) {
      console.error('SQL Error:', error.original)
    }
    throw error
  }
}

export default addSampleData
