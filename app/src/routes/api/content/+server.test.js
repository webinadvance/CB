import { jest } from '@jest/globals'

jest.mock(
  '@sveltejs/kit',
  () => ({
    json: (data, init) => new Response(JSON.stringify(data), init),
  }),
  { virtual: true },
)

jest.mock(
  'svelte/store',
  () => ({
    get: jest.fn(),
  }),
  { virtual: true },
)

jest.mock('$lib/database/models/content.js', () => ({
  Content: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
  },
}))

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
  }
  async json() {
    return JSON.parse(this.body)
  }
}

import { Content } from '$lib/database/models/content.js'

describe('Content DELETE Endpoint', () => {
  const mockData = [
    { id: 35, pageTitle: 'Home', key: 'A9[title].0', value: '1', lang: 'en' },
    { id: 36, pageTitle: 'Home', key: 'A9[desc].0', value: '2', lang: 'en' },
    { id: 37, pageTitle: 'Home', key: 'A9[title].1', value: '3', lang: 'en' },
    { id: 38, pageTitle: 'Home', key: 'A9[desc].1', value: '4', lang: 'en' },
    { id: 39, pageTitle: 'Home', key: 'A9[title].2', value: '5', lang: 'en' },
    { id: 40, pageTitle: 'Home', key: 'A9[desc].2', value: '6', lang: 'en' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    Content.findOne.mockResolvedValue({ id: 1 })
    Content.findAll.mockResolvedValue(mockData)
    Content.destroy.mockResolvedValue(2)
    Content.update.mockResolvedValue([1])
  })

  test('basic setup with mock data', async () => {
    await Content.findAll()
    expect(Content.findOne).toBeDefined()
    expect(Content.findAll).toHaveBeenCalled()
    expect(mockData.length).toBe(6)
  })
})
