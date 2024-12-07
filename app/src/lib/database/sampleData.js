import samplePages from '$lib/database/data/samplePages.js'
import sampleMedia from '$lib/database/data/sampleMedia.js'
import { Page } from '$lib/database/models/page.js'
import { Media } from '$lib/database/models/media.js'

//MM

async function addSampleData() {
  try {
    // Add sample pages
    for (const page of samplePages) {
      await Page.create({ ...page, isPublished: true })
      console.log(`Added page: ${page.title}`)
    }
    console.log(`Total pages in database: ${await Page.count()}`)

    // Add sample media
    for (const media of sampleMedia) {
      await Media.create(media)
      console.log(`Added media: ${media.filename}`)
    }
    console.log(`Total media in database: ${await Media.count()}`)
  } catch (error) {
    console.error('Failed to add sample data:', error.message)
    if (error.original) console.error('SQL Error:', error.original)
    throw error
  }
}

export default addSampleData
