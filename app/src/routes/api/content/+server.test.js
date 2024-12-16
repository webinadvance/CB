import { jest } from '@jest/globals'

jest.mock(
  '@sveltejs/kit',
  () => ({
    json: (data, init) => new Response(JSON.stringify(data), init),
  }),
  { virtual: true },
)

jest.mock('svelte/store', () => ({
  get: jest.fn(() => 'en'),
  writable: jest.fn(),
}))

jest.mock('$lib/stores/langStore.js', () => ({
  langStore: { value: 'en' },
}))

jest.mock('$lib/database/config.js', () => {
  const { Sequelize } = require('sequelize')
  return {
    __esModule: true,
    default: new Sequelize('sqlite::memory:', {
      logging: console.log,
    }),
  }
})

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
  }
  async json() {
    return JSON.parse(this.body)
  }
}

import { DELETE } from './+server.js'
import { Content } from '$lib/database/models/content.js'
import { Page } from '$lib/database/models/page.js'

describe('Content DELETE Integration Test', () => {
  beforeAll(async () => {
    await Page.sync({ force: true })
    await Content.sync({ force: true })
    const tables = await Content.sequelize.getQueryInterface().showAllTables()
    console.log(tables)
  })

  beforeEach(async () => {
    // Clear both tables
    await Content.destroy({ where: {} })
    await Page.destroy({ where: {} })

    // Seed the Pages table
    await Page.bulkCreate([
      { pageTitle: 'Home' }, // Add the required pageTitle
    ])

    // Seed the Content table
    await Content.bulkCreate([
      { pageTitle: 'Home', key: 'A9[title].0', value: '1', lang: 'en' },
      { pageTitle: 'Home', key: 'A9[desc].0', value: '2', lang: 'en' },
      { pageTitle: 'Home', key: 'A9[title].1', value: '3', lang: 'en' },
      { pageTitle: 'Home', key: 'A9[desc].1', value: '4', lang: 'en' },
      { pageTitle: 'Home', key: 'A9[title].2', value: '5', lang: 'en' },
      { pageTitle: 'Home', key: 'A9[desc].2', value: '6', lang: 'en' },
    ])
  })

  afterEach(async () => {
    await Content.destroy({ where: {} })
  })

  afterAll(async () => {
    await Content.sequelize.close()
  })

  test('deletes content and reindexes remaining items', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        pageTitle: 'Home',
        key: 'A9',
        index: 1,
      }),
    }

    const response = await DELETE({ request: mockRequest })
    expect(response.status).toBe(204)

    const remainingContent = await Content.findAll({
      where: { pageTitle: 'Home' },
      order: [['key', 'ASC']],
      raw: true,
    })

    expect(remainingContent).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          pageTitle: 'Home',
          key: 'A9[title].0',
          value: '1',
          lang: 'en',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(Number),
          pageTitle: 'Home',
          key: 'A9[desc].0',
          value: '2',
          lang: 'en',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(Number),
          pageTitle: 'Home',
          key: 'A9[title].1',
          value: '5',
          lang: 'en',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(Number),
          pageTitle: 'Home',
          key: 'A9[desc].1',
          value: '6',
          lang: 'en',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    )
  })
})
