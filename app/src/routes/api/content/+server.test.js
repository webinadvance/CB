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

jest.mock('$lib/database/config.js', () => ({
  __esModule: true,
  default: {
    transaction: jest.fn((callback) => callback({ transaction: 'mock' })),
  },
}))

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

import { DELETE } from './+server.js'
import { Content } from '$lib/database/models/content.js'
import { Op } from 'sequelize'

describe('Content DELETE Endpoint', () => {
  let mockRequest

  beforeEach(() => {
    jest.clearAllMocks()

    mockRequest = {
      json: jest.fn().mockResolvedValue({
        pageTitle: 'Home',
        key: 'A9',
        index: 1,
      }),
    }

    // Default successful responses
    Content.findOne.mockResolvedValue({ id: 1 })
    Content.findAll.mockResolvedValue([{ id: 39, key: 'A9[title].2' }])
    Content.destroy.mockResolvedValue(1)
    Content.update.mockResolvedValue([1])
  })

  test('successfully deletes content', async () => {
    const response = await DELETE({ request: mockRequest })
    expect(response.status).toBe(204)
    expect(Content.destroy).toHaveBeenCalled()
  })

  test('returns 400 for invalid parameters', async () => {
    mockRequest.json.mockResolvedValue({ pageTitle: 'Home' }) // missing key and index
    const response = await DELETE({ request: mockRequest })
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid input parameters.')
  })

  test('returns 500 for database errors', async () => {
    Content.findOne.mockImplementation(() => {
      throw new Error('DB Error')
    })
    const response = await DELETE({ request: mockRequest })
    const data = await response.json()
    expect(response.status).toBe(500)
    expect(data.error).toBe('DB Error')
  })
})
