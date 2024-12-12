import { Page } from './models/page.js'
import { Content } from './models/content.js'

const samplePages = [
  { title: 'Home', slug: '', componentName: 'HomeComponent' },
  { title: 'Test', slug: 'test', componentName: 'TestComponent' },
  {
    title: 'Dynamic',
    slug: 'aaa/bbb',
    componentName: 'TestComponent2',
    paramSchema: ['item1', 'item2'],
  },
  { title: 'Common' },
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
    value: { en: '© 2024 EN', it: '© 2024 IT' },
  },
]

async function addSampleData() {
  for (const page of samplePages) {
    const createdPage = await Page.create(page)
    const content = sampleContent.filter((c) => c.pageTitle === page.title)
    await Content.bulkCreate(
      content.map((c) => ({ ...c, pageId: createdPage.id })),
    )
  }
}

export default addSampleData
