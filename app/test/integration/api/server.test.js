import { jest } from '@jest/globals'
import { Content } from '$lib/database/models/content.js'
import { Page } from '$lib/database/models/page.js'
import { Op } from 'sequelize'
import { DELETE } from '../../../src/routes/api/content/+server.js'

jest.mock(
  '@sveltejs/kit',
  () => ({ json: (d, i) => new Response(JSON.stringify(d), i) }),
  { virtual: true },
)
jest.mock('svelte/store', () => ({
  get: jest.fn(() => 'en'),
  writable: jest.fn(),
}))
jest.mock('$lib/stores/langStore.js', () => ({ langStore: { value: 'en' } }))
jest.mock('$lib/database/config.js', () => ({
  __esModule: true,
  default: new (require('sequelize').Sequelize)('sqlite::memory:'),
}))
global.Response = class extends Response {}

describe('Content DELETE Integration Test', () => {
  beforeAll(async () => {
    await Page.sync({ force: true })
    await Content.sync({ force: true })
    await Content.sequelize.getQueryInterface().showAllTables()
  })
  beforeEach(async () => {
    await Content.destroy({ where: {} })
    await Page.destroy({ where: {} })
    await Page.bulkCreate([{ pageTitle: 'Home' }])
  })
  afterEach(async () => await Content.destroy({ where: {} }))
  afterAll(async () => await Content.sequelize.close())

  test('DELETE TEST1[A].1', async () => {
    await Content.bulkCreate([
      { pageTitle: 'Home', key: 'TEST1[A].0', value: '1', lang: 'en' },
      { pageTitle: 'Home', key: 'TEST1[B].0', value: '2', lang: 'en' },
      { pageTitle: 'Home', key: 'TEST1[A].1', value: '3', lang: 'en' },
      { pageTitle: 'Home', key: 'TEST1[B].1', value: '4', lang: 'en' },
      { pageTitle: 'Home', key: 'TEST1[A].2', value: '5', lang: 'en' },
      { pageTitle: 'Home', key: 'TEST1[B].2', value: '6', lang: 'en' },
    ])

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        pageTitle: 'Home',
        fullKey: 'TEST1[A].1',
      }),
    }

    const response = await DELETE({ request: mockRequest })
    expect(response.status).toBe(204)

    const remainingContent = await Content.findAll({
      where: { pageTitle: 'Home', key: { [Op.like]: 'TEST1%' } },
      order: [['key', 'ASC']],
      raw: true,
    })

    expect(remainingContent).not.toContainEqual({
      id: expect.any(Number),
      pageTitle: 'Home',
      key: 'TEST1[A].1',
      value: '3',
      lang: 'en',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })

    expect(remainingContent).not.toContainEqual({
      id: expect.any(Number),
      pageTitle: 'Home',
      key: 'TEST1[B].1',
      value: '4',
      lang: 'en',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })

    expect(remainingContent.length).toBe(4)
  })

  test('DELETE TEST1.1 (no tag)', async () => {
    await Content.bulkCreate([
      { pageTitle: 'Home', key: 'TEST1.0', value: '1', lang: 'en' },
      { pageTitle: 'Home', key: 'TEST1.1', value: '2', lang: 'en' },
      { pageTitle: 'Home', key: 'TEST1.2', value: '3', lang: 'en' },
    ])

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        pageTitle: 'Home',
        fullKey: 'TEST1.1',
      }),
    }

    const response = await DELETE({ request: mockRequest })
    expect(response.status).toBe(204)

    const remainingContent = await Content.findAll({
      where: { pageTitle: 'Home', key: { [Op.like]: 'TEST1.%' } },
      order: [['key', 'ASC']],
      raw: true,
    })

    expect(remainingContent).not.toContainEqual({
      id: expect.any(Number),
      pageTitle: 'Home',
      key: 'TEST1.1',
      value: '2',
      lang: 'en',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })

    expect(remainingContent.length).toBe(2)
  })

  test('DELETE SIMPLE-KEY', async () => {
    await Content.bulkCreate([
      { pageTitle: 'Home', key: 'SIMPLE-KEY', value: '1', lang: 'en' },
      { pageTitle: 'Home', key: 'OTHER-KEY', value: '2', lang: 'en' },
    ])

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        pageTitle: 'Home',
        fullKey: 'SIMPLE-KEY',
      }),
    }

    const response = await DELETE({ request: mockRequest })
    expect(response.status).toBe(204)

    const remainingContent = await Content.findAll({
      where: { pageTitle: 'Home' },
      raw: true,
    })

    expect(remainingContent).not.toContainEqual({
      id: expect.any(Number),
      pageTitle: 'Home',
      key: 'SIMPLE-KEY',
      value: '1',
      lang: 'en',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })

    expect(remainingContent.length).toBe(1)
  })
})
