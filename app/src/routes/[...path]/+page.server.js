/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  // Mock data matching the database structure
  const mockPages = [
    {
      title: 'Home',
      slug: 'home',
      contentData: {
        'main-content': { content: 'Welcome' },
        'hero-title': { content: 'Hero Title' },
      },
      paramSchema: [],
    },
    {
      title: 'Test',
      slug: 'test',
      componentName: 'TestComponent',
      contentData: {
        'main-content': { content: 'Test content' },
      },
      paramSchema: [],
    },
    {
      title: 'Dynamic',
      slug: 'aaa/bbb',
      componentName: 'TestComponent2',
      paramSchema: ['item1', 'item2'],
      contentData: {
        'main-content': { content: 'Dynamic content' },
      },
    },
  ]

  const pathParts = params.path.split('/')

  // Simulate the same path matching logic
  for (let i = pathParts.length; i > 0; i--) {
    const testPath = pathParts.slice(0, i).join('/')
    const page = mockPages.find((p) => p.slug === testPath)

    if (page) {
      const routeParams = Object.fromEntries(
        (page.paramSchema || []).map((name, index) => [
          name,
          pathParts.slice(i)[index],
        ]),
      )
      return { page, routeParams }
    }
  }

  return { page: null }
}
