import { Page } from './models/page.js'

async function addSampleData() {
  try {
    await Page.bulkCreate([
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
    ])
    console.log('Sample data added successfully')
  } catch (error) {
    console.error('Failed to add sample data:', error)
    throw error
  }
}

export default addSampleData
