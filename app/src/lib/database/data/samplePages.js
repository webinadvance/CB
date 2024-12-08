const samplePages = [
  {
    title: 'Home',
    slug: 'home',
    contentData: { 'main-content': { content: 'Welcome' } },
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
]

export default samplePages
