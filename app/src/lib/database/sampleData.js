import { Page } from './models/page.js'
import { Content } from './models/content.js'
import { Media } from './models/media.js'
import fetch from 'node-fetch'

const samplePages = [
  { pageTitle: 'Home', slug: '', componentName: 'HomeComponent' },
  { pageTitle: 'Test', slug: 'test', componentName: 'TestComponent' },
  {
    pageTitle: 'Dynamic',
    slug: 'aaa/bbb',
    componentName: 'TestComponent2',
    paramSchema: ['item1', 'item2'],
  },
  { pageTitle: 'Common' },
]

const sampleContent = [
  { pageTitle: 'Home', key: 'main-content', value: 'EN', lang: 'en' },
  { pageTitle: 'Home', key: 'main-content', value: 'IT', lang: 'it' },
  {
    pageTitle: 'Test',
    key: 'main-content',
    value: 'Dynamic content',
    lang: 'en',
  },
  {
    pageTitle: 'Test',
    key: 'main-content',
    value: 'Contenuto Dinamico',
    lang: 'it',
  },
  {
    pageTitle: 'Dynamic',
    key: 'main-content',
    value: 'Content 1',
    lang: 'en',
  },
  {
    pageTitle: 'Dynamic',
    key: 'main-content',
    value: 'Contenuto 1',
    lang: 'it',
  },
  {
    pageTitle: 'Dynamic',
    key: 'main-content2',
    value: 'Content 2',
    lang: 'en',
  },
  {
    pageTitle: 'Dynamic',
    key: 'main-content2',
    value: 'Contenuto 2',
    lang: 'it',
  },
  {
    pageTitle: 'Common',
    key: 'footer',
    value: '© 2024 EN',
    lang: 'en',
  },
  {
    pageTitle: 'Common',
    key: 'footer',
    value: '© 2024 IT',
    lang: 'it',
  },
]

export const loadMediaFromUrl = async (url) => {
  const response = await fetch(url)
  const content = await response.buffer()
  return {
    filename: 'test.png',
    mimeType: 'image/png',
    size: content.length,
    content,
    uploadedBy: 'system',
  }
}

async function addSampleData() {
  for (const page of samplePages) {
    const createdPage = await Page.create(page)
    const content = sampleContent.filter((c) => c.pageTitle === page.pageTitle)
    await Content.bulkCreate(
      content.map((c) => ({ ...c, pageId: createdPage.id })),
    )
  }

  const mediaSample = await loadMediaFromUrl(
    'https://upload.wikimedia.org/wikipedia/commons/6/6a/PNG_Test.png',
  )
  await Media.create(mediaSample)
}

export default addSampleData
