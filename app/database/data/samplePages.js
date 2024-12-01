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
    contentData: { 'main-content': { content: 'Test content' } },
  },
  {
    title: 'Dynamic',
    slug: 'aaa/bbb',
    componentName: 'TestComponent2',
    paramSchema: ['item1', 'item2'],
    contentData: { 'main-content': { content: 'Dynamic content' } },
  },
]

export default samplePages
