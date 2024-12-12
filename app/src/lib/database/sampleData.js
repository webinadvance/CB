import { Page } from './models/page.js'
import { Content } from './models/content.js'
import { Media } from './models/media.js'
import { loadMediaFromUrl } from './data/sampleMedia.js'

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
  { pageTitle: 'Home', key: 'main-content', value: { en: 'EN', it: 'IT' } },
  {
    pageTitle: 'Test',
    key: 'main-content',
    value: { en: 'Dynamic content', it: 'Contenuto Dinamico' },
  },
  {
    pageTitle: 'Dynamic',
    key: 'main-content',
    value: { en: 'Content 1', it: 'Contenuto 1' },
  },
  {
    pageTitle: 'Dynamic',
    key: 'main-content2',
    value: { en: 'Content 2', it: 'Contenuto 2' },
  },
  {
    pageTitle: 'Common',
    key: 'footer',
    value: { en: 'Â© 2024 EN', it: 'Â© 2024 IT' },
  },
]

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
