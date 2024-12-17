import { jest } from '@jest/globals'
import { Content } from '$lib/database/models/content.js'
import { Page } from '$lib/database/models/page.js'
import { DELETE, POST } from '../../../src/routes/api/content/+server.js'
import { POST as REORDER } from '../../../src/routes/api/content/reorder/+server.js'

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

describe('Content API Integration Tests', () => {
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

  test('DELETE: Removes indexed content correctly', async () => {
    await Content.bulkCreate([
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'A',
        index: 0,
        value: '1',
        lang: 'en',
      },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'B',
        index: 0,
        value: '2',
        lang: 'en',
      },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'A',
        index: 1,
        value: '3',
        lang: 'en',
      },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'B',
        index: 1,
        value: '4',
        lang: 'en',
      },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'A',
        index: 2,
        value: '5',
        lang: 'en',
      },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'B',
        index: 2,
        value: '6',
        lang: 'en',
      },
    ])

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        pageTitle: 'Home',
        key: 'TEST1',
        tag: 'A',
        index: 1,
      }),
    }

    const response = await DELETE({ request: mockRequest })
    expect(response.status).toBe(204)

    const remainingContent = await Content.findAll({
      attributes: ['baseKey', 'tag', 'index', 'value'],
      where: { pageTitle: 'Home', baseKey: 'TEST1' },
      order: [
        ['tag', 'ASC'],
        ['index', 'ASC'],
      ],
      raw: true,
    })

    expect(remainingContent).toEqual([
      { baseKey: 'TEST1', tag: 'A', index: 0, value: '1' },
      { baseKey: 'TEST1', tag: 'A', index: 1, value: '5' },
      { baseKey: 'TEST1', tag: 'B', index: 0, value: '2' },
      { baseKey: 'TEST1', tag: 'B', index: 1, value: '4' },
      { baseKey: 'TEST1', tag: 'B', index: 2, value: '6' },
    ])
  })

  test('DELETE: Key only removes all related records', async () => {
    await Content.bulkCreate([
      { pageTitle: 'Home', baseKey: 'TEST1', tag: 'A', index: 0, value: '1' },
      { pageTitle: 'Home', baseKey: 'TEST1', tag: 'B', index: 0, value: '2' },
      { pageTitle: 'Home', baseKey: 'OTHER', value: 'stays' },
    ])

    const response = await DELETE({
      request: { json: () => ({ pageTitle: 'Home', key: 'TEST1' }) },
    })

    expect(response.status).toBe(204)
    const remaining = await Content.findAll({ raw: true })
    expect(remaining).toHaveLength(1)
    expect(remaining[0]).toMatchObject({ baseKey: 'OTHER' })
  })

  test('DELETE: Key + Tag removes all matching records', async () => {
    await Content.bulkCreate([
      { pageTitle: 'Home', baseKey: 'TEST1', tag: 'A', index: 0, value: '1' },
      { pageTitle: 'Home', baseKey: 'TEST1', tag: 'A', index: 1, value: '2' },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'B',
        index: 0,
        value: 'stays',
      },
    ])

    const response = await DELETE({
      request: { json: () => ({ pageTitle: 'Home', key: 'TEST1', tag: 'A' }) },
    })

    expect(response.status).toBe(204)
    const remaining = await Content.findAll({ raw: true })
    expect(remaining).toHaveLength(1)
    expect(remaining[0]).toMatchObject({ tag: 'B' })
  })

  test('DELETE: Key + Tag + Index removes specific record', async () => {
    await Content.bulkCreate([
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'A',
        index: 0,
        value: 'stays',
      },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'A',
        index: 1,
        value: 'removes',
      },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'B',
        index: 1,
        value: 'stays',
      },
    ])

    const response = await DELETE({
      request: {
        json: () => ({ pageTitle: 'Home', key: 'TEST1', tag: 'A', index: 1 }),
      },
    })

    expect(response.status).toBe(204)
    const remaining = await Content.findAll({
      order: [
        ['tag', 'ASC'],
        ['index', 'ASC'],
      ],
      raw: true,
    })
    expect(remaining).toHaveLength(2)
    expect(remaining.map((r) => r.value)).toEqual(['stays', 'stays'])
  })

  test('DELETE: With strict mode removes all records with same key and index', async () => {
    await Content.bulkCreate([
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'A',
        index: 0,
        value: 'stays0',
      },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'B',
        index: 0,
        value: 'stays1',
      },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'A',
        index: 1,
        value: 'removes1',
      },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'B',
        index: 1,
        value: 'removes2',
      },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'A',
        index: 2,
        value: 'shifts1',
      },
      {
        pageTitle: 'Home',
        baseKey: 'TEST1',
        tag: 'B',
        index: 2,
        value: 'shifts2',
      },
    ])

    const response = await DELETE({
      request: {
        json: () => ({
          pageTitle: 'Home',
          key: 'TEST1',
          tag: 'A', // tag is ignored in strict mode
          index: 1,
          strict: true,
        }),
      },
    })

    expect(response.status).toBe(204)
    const remaining = await Content.findAll({
      attributes: ['baseKey', 'tag', 'index', 'value'],
      order: [
        ['tag', 'ASC'],
        ['index', 'ASC'],
      ],
      raw: true,
    })

    expect(remaining).toEqual([
      { baseKey: 'TEST1', tag: 'A', index: 0, value: 'stays0' },
      { baseKey: 'TEST1', tag: 'A', index: 1, value: 'shifts1' },
      { baseKey: 'TEST1', tag: 'B', index: 0, value: 'stays1' },
      { baseKey: 'TEST1', tag: 'B', index: 1, value: 'shifts2' },
    ])
  })

  test('REORDER: Swaps all records with same key and index when tag not provided', async () => {
    await Content.bulkCreate([
      {
        pageTitle: 'Home',
        baseKey: 'MENU',
        tag: 'A',
        index: 0,
        value: 'first-a',
      },
      {
        pageTitle: 'Home',
        baseKey: 'MENU',
        tag: 'B',
        index: 0,
        value: 'first-b',
      },
      {
        pageTitle: 'Home',
        baseKey: 'MENU',
        tag: 'A',
        index: 1,
        value: 'second-a',
      },
      {
        pageTitle: 'Home',
        baseKey: 'MENU',
        tag: 'B',
        index: 1,
        value: 'second-b',
      },
    ])

    const response = await REORDER({
      request: {
        json: () => ({
          pageTitle: 'Home',
          key: 'MENU',
          startIndex: 0,
          endIndex: 1,
        }),
      },
    })

    expect(response.status).toBe(200)
    const content = await Content.findAll({
      attributes: ['tag', 'index', 'value'],
      where: { pageTitle: 'Home', baseKey: 'MENU' },
      order: [
        ['tag', 'ASC'],
        ['index', 'ASC'],
      ],
      raw: true,
    })

    expect(content).toEqual([
      { tag: 'A', index: 0, value: 'second-a' },
      { tag: 'A', index: 1, value: 'first-a' },
      { tag: 'B', index: 0, value: 'second-b' },
      { tag: 'B', index: 1, value: 'first-b' },
    ])
  })

  test('REORDER: Swaps only specific tag records when provided', async () => {
    await Content.bulkCreate([
      {
        pageTitle: 'Home',
        baseKey: 'MENU',
        tag: 'A',
        index: 0,
        value: 'first-a',
      },
      {
        pageTitle: 'Home',
        baseKey: 'MENU',
        tag: 'B',
        index: 0,
        value: 'first-b',
      },
      {
        pageTitle: 'Home',
        baseKey: 'MENU',
        tag: 'A',
        index: 1,
        value: 'second-a',
      },
      {
        pageTitle: 'Home',
        baseKey: 'MENU',
        tag: 'B',
        index: 1,
        value: 'second-b',
      },
    ])

    const response = await REORDER({
      request: {
        json: () => ({
          pageTitle: 'Home',
          key: 'MENU',
          tag: 'A',
          startIndex: 0,
          endIndex: 1,
        }),
      },
    })

    expect(response.status).toBe(200)
    const content = await Content.findAll({
      attributes: ['tag', 'index', 'value'],
      where: { pageTitle: 'Home', baseKey: 'MENU' },
      order: [
        ['tag', 'ASC'],
        ['index', 'ASC'],
      ],
      raw: true,
    })

    expect(content).toEqual([
      { tag: 'A', index: 0, value: 'second-a' },
      { tag: 'A', index: 1, value: 'first-a' },
      { tag: 'B', index: 0, value: 'first-b' },
      { tag: 'B', index: 1, value: 'second-b' },
    ])
  })
})
