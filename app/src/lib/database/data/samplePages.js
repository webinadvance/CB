const samplePages = [
  {
    title: 'Home',
    slug: 'home',
    contentData: {
      'main-content': { content: { en: 'Welcome', it: 'Benvenuto' } },
    },
  },
  {
    title: 'Test',
    slug: 'test',
    componentName: 'TestComponent',
    contentData: {
      'main-content': {
        content: { en: 'Test content', it: 'Contenuto di test' },
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
        content: { en: 'Dynamic content', it: 'Contenuto dinamico' },
      },
    },
  },
]

export default samplePages
