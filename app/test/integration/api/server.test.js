import { jest } from '@jest/globals'
import { DELETE } from '../../../src/routes/api/content/+server.js'
import { Content } from '$lib/database/models/content.js'
import { Page } from '$lib/database/models/page.js'
import { Op } from 'sequelize'

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
    await Content.bulkCreate([
      { pageTitle: 'Home', key: 'A9[title].0', value: '1', lang: 'en' },
      { pageTitle: 'Home', key: 'A9[desc].0', value: '2', lang: 'en' },
      { pageTitle: 'Home', key: 'A9[title].1', value: '3', lang: 'en' },
      { pageTitle: 'Home', key: 'A9[desc].1', value: '4', lang: 'en' },
      { pageTitle: 'Home', key: 'A9[title].2', value: '5', lang: 'en' },
      { pageTitle: 'Home', key: 'A9[desc].2', value: '6', lang: 'en' },
      { pageTitle: 'Home', key: 'A10.0', value: 'A10.0', lang: 'en' },
      { pageTitle: 'Home', key: 'A10.1', value: 'A10.1', lang: 'en' },
      { pageTitle: 'Home', key: 'A10.2', value: 'A10.2', lang: 'en' },
    ])
  })
  afterEach(async () => await Content.destroy({ where: {} }))
  afterAll(async () => await Content.sequelize.close())
  test('DELETE A9[title].1', async () => {
    const mockRequest = {
      json: jest
        .fn()
        .mockResolvedValue({ pageTitle: 'Home', key: 'A9', index: 1 }),
    }
    const response = await DELETE({ request: mockRequest })
    expect(response.status).toBe(204)
    const remainingContent = await Content.findAll({
      where: { pageTitle: 'Home' },
      order: [['key', 'ASC']],
      raw: true,
    })

    expect(remainingContent).not.toContainEqual({
      pageTitle: 'Home',
      key: 'A9[title].1',
      value: '3',
      lang: 'en',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })

    expect(remainingContent).toContainEqual({
      id: expect.any(Number),
      pageTitle: 'Home',
      key: 'A9[title].0',
      value: '1',
      lang: 'en',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
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
          key: 'A9[title].2',
          value: '5',
          lang: 'en',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(Number),
          pageTitle: 'Home',
          key: 'A9[desc].2',
          value: '6',
          lang: 'en',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    )
  })

  test('DELETE A10.1', async () => {
    const mockRequest = {
      json: jest
        .fn()
        .mockResolvedValue({ pageTitle: 'Home', key: 'A10', index: 1 }),
    }
    const response = await DELETE({ request: mockRequest })
    expect(response.status).toBe(204)

    const a10Content = await Content.findAll({
      where: { pageTitle: 'Home', key: { [Op.like]: 'A10.%' } },
      order: [['key', 'ASC']],
      raw: true,
    })

    expect(a10Content).toEqual([
      {
        id: expect.any(Number),
        pageTitle: 'Home',
        key: 'A10.0',
        value: 'A10.0',
        lang: 'en',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      {
        id: expect.any(Number),
        pageTitle: 'Home',
        key: 'A10.2',
        value: 'A10.2',
        lang: 'en',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ])
    expect(a10Content).not.toContainEqual({
      id: expect.any(Number),
      pageTitle: 'Home',
      key: 'A10.1',
      value: 'A10.1',
      lang: 'en',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })
})
