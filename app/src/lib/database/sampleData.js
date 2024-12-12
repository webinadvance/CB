// sampleData.js
import { Page } from './models/page.js'
import { Content } from './models/content.js'

const samplePages = [
  {
    title: 'Home',
    slug: '',
    componentName: 'HomeComponent',
    contentData: {
      'main-content': {
        en: 'EN',
        it: 'IT',
      },
    },
  },
  {
    title: 'Test',
    slug: 'test',
    componentName: 'TestComponent',
    contentData: {
      'main-content': {
        en: 'Dynamic content FROM TEST PAGE AAAA',
        it: 'Contenuto Dinamico FROM TEST PAGE AAAA',
      },
    },
  },
  {
    title: 'Dynamic',
    slug: 'aaa/bbb',
    componentName: 'TestComponent2',
    paramSchema: ['item1', 'item2'],
    contentData: {
      'main-content': {
        en: 'Dynamic content',
        it: 'Contenuto Dinamico',
      },
      'main-content2': {
        en: 'Dynamic content 2 FROM Dynamic PAGE',
        it: 'Contenuto Dinamico 2 FROM Dynamic PAGE',
      },
    },
  },
  {
    title: 'Common',
    contentData: {
      footer: {
        en: '© 2024 Palazzo Odescalchi EN',
        it: '© 2024 Palazzo Odescalchi IT',
      },
    },
  },
]

const sampleContent = [
  { pageTitle: 'Home', key: 'main-content', value: { en: 'EN', it: 'IT' } },
  {
    pageTitle: 'Test',
    key: 'main-content',
    value: {
      en: 'Dynamic content FROM TEST PAGE AAAA',
      it: 'Contenuto Dinamico FROM TEST PAGE AAAA',
    },
  },
  {
    pageTitle: 'Dynamic',
    key: 'main-content',
    value: { en: 'Dynamic content', it: 'Contenuto Dinamico' },
  },
  {
    pageTitle: 'Dynamic',
    key: 'main-content2',
    value: {
      en: 'Dynamic content 2 FROM Dynamic PAGE',
      it: 'Contenuto Dinamico 2 FROM Dynamic PAGE',
    },
  },
  {
    pageTitle: 'Common',
    key: 'footer',
    value: {
      en: '© 2024 Palazzo Odescalchi EN',
      it: '© 2024 Palazzo Odescalchi IT',
    },
  },
]

async function addSampleData() {
  try {
    for (const page of samplePages) {
      const createdPage = await Page.create({ ...page, isPublished: true })
      const pageContent = sampleContent.filter(
        (c) => c.pageTitle === page.title,
      )
      await Promise.all(
        pageContent.map((c) =>
          Content.create({
            pageId: createdPage.id,
            key: c.key,
            value: c.value,
          }),
        ),
      )
    }
  } catch (error) {
    console.error('Failed:', error)
    throw error
  }
}

export default addSampleData
