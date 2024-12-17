import { jest } from '@jest/globals'
import { Content } from '$lib/database/models/content.js'
import { Page } from '$lib/database/models/page.js'
import { DELETE, POST } from '../../../src/routes/api/content/+server.js'
import { POST as REORDER } from '../../../src/routes/api/content/reorder/+server.js'
import { Media } from '$lib/database/models/media.js'
import { POST as MEDIA_POST } from '../../../src/routes/api/media/+server.js'
import { DELETE as MEDIA_DELETE } from '../../../src/routes/api/media/[id]/+server.js'
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
global.File = class File {
  constructor(bits, name, options) {
    this.name = name
    this.type = options?.type
    this.size = bits[0].length // Set correct size based on content
    this.arrayBuffer = () => Promise.resolve(bits[0])
  }
}
global.FormData = class FormData {
  constructor() {
    this.data = new Map()
  }
  append(key, value) {
    this.data.set(key, value)
  }
  get(key) {
    return this.data.get(key)
  }
}

describe('Content API Integration Tests', () => {
  beforeAll(async () => {
    await Media.sync({ force: true })
    await Page.sync({ force: true })
    await Content.sync({ force: true })
    await Content.sequelize.getQueryInterface().showAllTables()
  })
  beforeEach(async () => {
    await Content.destroy({ where: {} })
    await Media.destroy({ where: {} })
    await Page.destroy({ where: {} })
    await Page.bulkCreate([{ pageTitle: 'Home' }])
  })

  afterEach(async () => {
    await Content.destroy({ where: {} })
    await Media.destroy({ where: {} })
    await Page.destroy({ where: {} })
  })

  afterAll(async () => {
    if (Content.sequelize) {
      await Content.sequelize.close()
    }
  })

  test('DELETE: Removes indexed content correctly', async () => {
    await Content.bulkCreate([
      {
        pageTitle: 'Home',
        key: 'TEST1',
        tag: 'A',
        index: 0,
        value: '1',
        lang: 'en',
      },
      {
        pageTitle: 'Home',
        key: 'TEST1',
        tag: 'B',
        index: 0,
        value: '2',
        lang: 'en',
      },
      {
        pageTitle: 'Home',
        key: 'TEST1',
        tag: 'A',
        index: 1,
        value: '3',
        lang: 'en',
      },
      {
        pageTitle: 'Home',
        key: 'TEST1',
        tag: 'B',
        index: 1,
        value: '4',
        lang: 'en',
      },
      {
        pageTitle: 'Home',
        key: 'TEST1',
        tag: 'A',
        index: 2,
        value: '5',
        lang: 'en',
      },
      {
        pageTitle: 'Home',
        key: 'TEST1',
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
      attributes: ['key', 'tag', 'index', 'value'],
      where: { pageTitle: 'Home', key: 'TEST1' },
      order: [
        ['tag', 'ASC'],
        ['index', 'ASC'],
      ],
      raw: true,
    })

    expect(remainingContent).toEqual([
      { key: 'TEST1', tag: 'A', index: 0, value: '1' },
      { key: 'TEST1', tag: 'A', index: 1, value: '5' },
      { key: 'TEST1', tag: 'B', index: 0, value: '2' },
      { key: 'TEST1', tag: 'B', index: 1, value: '4' },
      { key: 'TEST1', tag: 'B', index: 2, value: '6' },
    ])
  })

  test('DELETE: Key only removes all related records', async () => {
    await Content.bulkCreate([
      { pageTitle: 'Home', key: 'TEST1', tag: 'A', index: 0, value: '1' },
      { pageTitle: 'Home', key: 'TEST1', tag: 'B', index: 0, value: '2' },
      { pageTitle: 'Home', key: 'OTHER', value: 'stays' },
    ])

    const response = await DELETE({
      request: { json: () => ({ pageTitle: 'Home', key: 'TEST1' }) },
    })

    expect(response.status).toBe(204)
    const remaining = await Content.findAll({ raw: true })
    expect(remaining).toHaveLength(1)
    expect(remaining[0]).toMatchObject({ key: 'OTHER' })
  })

  test('DELETE: Key + Tag removes all matching records', async () => {
    await Content.bulkCreate([
      { pageTitle: 'Home', key: 'TEST1', tag: 'A', index: 0, value: '1' },
      { pageTitle: 'Home', key: 'TEST1', tag: 'A', index: 1, value: '2' },
      {
        pageTitle: 'Home',
        key: 'TEST1',
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
        key: 'TEST1',
        tag: 'A',
        index: 0,
        value: 'stays',
      },
      {
        pageTitle: 'Home',
        key: 'TEST1',
        tag: 'A',
        index: 1,
        value: 'removes',
      },
      {
        pageTitle: 'Home',
        key: 'TEST1',
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
        key: 'TEST1',
        tag: 'A',
        index: 0,
        value: 'stays0',
      },
      {
        pageTitle: 'Home',
        key: 'TEST1',
        tag: 'B',
        index: 0,
        value: 'stays1',
      },
      {
        pageTitle: 'Home',
        key: 'TEST1',
        tag: 'A',
        index: 1,
        value: 'removes1',
      },
      {
        pageTitle: 'Home',
        key: 'TEST1',
        tag: 'B',
        index: 1,
        value: 'removes2',
      },
      {
        pageTitle: 'Home',
        key: 'TEST1',
        tag: 'A',
        index: 2,
        value: 'shifts1',
      },
      {
        pageTitle: 'Home',
        key: 'TEST1',
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
      attributes: ['key', 'tag', 'index', 'value'],
      order: [
        ['tag', 'ASC'],
        ['index', 'ASC'],
      ],
      raw: true,
    })

    expect(remaining).toEqual([
      { key: 'TEST1', tag: 'A', index: 0, value: 'stays0' },
      { key: 'TEST1', tag: 'A', index: 1, value: 'shifts1' },
      { key: 'TEST1', tag: 'B', index: 0, value: 'stays1' },
      { key: 'TEST1', tag: 'B', index: 1, value: 'shifts2' },
    ])
  })

  test('REORDER: Swaps all records with same key and index when tag not provided', async () => {
    await Content.bulkCreate([
      {
        pageTitle: 'Home',
        key: 'MENU',
        tag: 'A',
        index: 0,
        value: 'first-a',
      },
      {
        pageTitle: 'Home',
        key: 'MENU',
        tag: 'B',
        index: 0,
        value: 'first-b',
      },
      {
        pageTitle: 'Home',
        key: 'MENU',
        tag: 'A',
        index: 1,
        value: 'second-a',
      },
      {
        pageTitle: 'Home',
        key: 'MENU',
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
      where: { pageTitle: 'Home', key: 'MENU' },
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
        key: 'MENU',
        tag: 'A',
        index: 0,
        value: 'first-a',
      },
      {
        pageTitle: 'Home',
        key: 'MENU',
        tag: 'B',
        index: 0,
        value: 'first-b',
      },
      {
        pageTitle: 'Home',
        key: 'MENU',
        tag: 'A',
        index: 1,
        value: 'second-a',
      },
      {
        pageTitle: 'Home',
        key: 'MENU',
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
      where: { pageTitle: 'Home', key: 'MENU' },
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

  test('POST: Creates simple content without tag/index', async () => {
    const response = await POST({
      request: {
        json: () => ({
          pageTitle: 'Home',
          key: 'myKey',
          value: 'fd',
        }),
      },
    })

    expect(response.status).toBe(201)
    const content = await Content.findOne({
      where: { pageTitle: 'Home', key: 'myKey' },
      raw: true,
    })
    expect(content).toMatchObject({
      value: 'fd',
      tag: null,
      index: null,
    })
  })

  test('POST: Updates existing simple content', async () => {
    await Content.create({
      pageTitle: 'Home',
      key: 'myKey',
      value: 'original',
    })

    const response = await POST({
      request: {
        json: () => ({
          pageTitle: 'Home',
          key: 'myKey',
          value: 'updated',
        }),
      },
    })

    expect(response.status).toBe(200)
    const content = await Content.findOne({
      where: { pageTitle: 'Home', key: 'myKey' },
      raw: true,
    })
    expect(content.value).toBe('updated')
    expect(content.tag).toBeNull()
    expect(content.index).toBeNull()
  })

  test('POST: Successfully uploads media file', async () => {
    const fileContent = Buffer.from('test')
    const mockFile = new File([fileContent], 'test.jpg', { type: 'image/jpeg' })

    const formData = new FormData()
    formData.append('file', mockFile)
    formData.append('lang', 'en')
    formData.append('key', 'testKey')
    formData.append('pageTitle', 'Home')

    const response = await MEDIA_POST({
      request: {
        headers: {
          get: (name) => (name === 'content-length' ? '4' : null),
        },
        formData: () => Promise.resolve(formData),
      },
    })

    const result = await response.json()
    expect(response.status).toBe(201)
    expect(result).toHaveProperty('id')

    const savedMedia = await Media.findByPk(result.id)
    expect(savedMedia).toMatchObject({
      filename: 'test.jpg',
      mimeType: 'image/jpeg',
      size: fileContent.length, // Will be 4 bytes
    })
  })

  test('DELETE: Removes media and correctly reindexes complex content structure', async () => {
    const [media1, media2, media3] = await Promise.all([
      Media.create({
        filename: '1.jpg',
        mimeType: 'image/jpeg',
        size: 4,
        content: Buffer.from('test1'),
      }),
      Media.create({
        filename: '2.jpg',
        mimeType: 'image/jpeg',
        size: 4,
        content: Buffer.from('test2'),
      }),
      Media.create({
        filename: '3.jpg',
        mimeType: 'image/jpeg',
        size: 4,
        content: Buffer.from('test3'),
      }),
    ])

    await Content.bulkCreate([
      {
        pageTitle: 'Home',
        key: 'img',
        value: media1.id.toString(),
        lang: 'en',
        index: 0,
      },
      {
        pageTitle: 'Home',
        key: 'img',
        value: media2.id.toString(),
        lang: 'en',
        index: 1,
      },
      {
        pageTitle: 'Home',
        key: 'img',
        value: media3.id.toString(),
        lang: 'en',
        index: 2,
      },
      { pageTitle: 'Home', key: 'img', value: '444', lang: 'en', index: 3 },
      { pageTitle: 'Home', key: 'img', value: '555', lang: 'en', index: 4 },
      // Different key/lang to verify isolation
      { pageTitle: 'Home', key: 'other', value: '666', lang: 'en', index: 0 },
      { pageTitle: 'Home', key: 'img', value: '777', lang: 'fr', index: 0 },
    ])

    // Delete from middle (index 1)
    const response1 = await MEDIA_DELETE({
      params: { id: media2.id },
      request: {
        json: () =>
          Promise.resolve({
            pageTitle: 'Home',
            key: 'img',
            lang: 'en',
            index: 1,
          }),
      },
    })

    expect(response1.status).toBe(200)
    expect(await Media.findByPk(media2.id)).toBeNull()

    let content = await Content.findAll({
      where: { pageTitle: 'Home', key: 'img', lang: 'en' },
      order: [['index', 'ASC']],
      raw: true,
    })

    expect(content).toHaveLength(4)
    expect(content.map((c) => ({ index: c.index, value: c.value }))).toEqual([
      { index: 0, value: media1.id.toString() },
      { index: 1, value: media3.id.toString() },
      { index: 2, value: '444' },
      { index: 3, value: '555' },
    ])

    // Delete from start (index 0)
    const response2 = await MEDIA_DELETE({
      params: { id: media1.id },
      request: {
        json: () =>
          Promise.resolve({
            pageTitle: 'Home',
            key: 'img',
            lang: 'en',
            index: 0,
          }),
      },
    })

    content = await Content.findAll({
      where: { pageTitle: 'Home', key: 'img', lang: 'en' },
      order: [['index', 'ASC']],
      raw: true,
    })

    expect(content).toHaveLength(3)
    expect(content.map((c) => ({ index: c.index, value: c.value }))).toEqual([
      { index: 0, value: media3.id.toString() },
      { index: 1, value: '444' },
      { index: 2, value: '555' },
    ])

    // Verify other content remained unchanged
    const otherContent = await Content.findAll({
      where: {
        [Op.or]: [{ key: 'other' }, { lang: 'fr' }],
      },
      raw: true,
    })

    expect(otherContent).toHaveLength(2)
    expect(
      otherContent.map((c) => ({
        key: c.key,
        lang: c.lang,
        index: c.index,
        value: c.value,
      })),
    ).toEqual([
      { key: 'other', lang: 'en', index: 0, value: '666' },
      { key: 'img', lang: 'fr', index: 0, value: '777' },
    ])
  })

  test('DELETE: Removes media and reindexes tagged images correctly', async () => {
    const [media1, media2, media3] = await Promise.all([
      Media.create({
        filename: '1.jpg',
        mimeType: 'image/jpeg',
        size: 4,
        content: Buffer.from('test1'),
      }),
      Media.create({
        filename: '2.jpg',
        mimeType: 'image/jpeg',
        size: 4,
        content: Buffer.from('test2'),
      }),
      Media.create({
        filename: '3.jpg',
        mimeType: 'image/jpeg',
        size: 4,
        content: Buffer.from('test3'),
      }),
    ])

    // Create content with tags
    await Content.bulkCreate([
      {
        pageTitle: 'Home',
        key: 'img',
        value: media1.id.toString(),
        lang: 'en',
        index: 0,
        tag: 'image1',
      },
      {
        pageTitle: 'Home',
        key: 'img',
        value: media2.id.toString(),
        lang: 'en',
        index: 1,
        tag: 'image1',
      },
      {
        pageTitle: 'Home',
        key: 'img',
        value: media3.id.toString(),
        lang: 'en',
        index: 2,
        tag: 'image1',
      },
      // Add some other tags to verify isolation
      {
        pageTitle: 'Home',
        key: 'img',
        value: '888',
        lang: 'en',
        index: 0,
        tag: 'image2',
      },
      {
        pageTitle: 'Home',
        key: 'img',
        value: '999',
        lang: 'en',
        index: 1,
        tag: 'image2',
      },
    ])

    // Delete middle image
    const response = await MEDIA_DELETE({
      params: { id: media2.id },
      request: {
        json: () =>
          Promise.resolve({
            pageTitle: 'Home',
            key: 'img',
            lang: 'en',
            index: 1,
            tag: 'image1',
          }),
      },
    })

    expect(response.status).toBe(200)
    expect(await Media.findByPk(media2.id)).toBeNull()

    // Verify image1 tag content
    const image1Content = await Content.findAll({
      where: { pageTitle: 'Home', key: 'img', lang: 'en', tag: 'image1' },
      order: [['index', 'ASC']],
      raw: true,
    })

    expect(image1Content).toHaveLength(2)
    expect(
      image1Content.map((c) => ({ index: c.index, value: c.value })),
    ).toEqual([
      { index: 0, value: media1.id.toString() },
      { index: 1, value: media3.id.toString() },
    ])

    // Verify image2 tag remained unchanged
    const image2Content = await Content.findAll({
      where: { pageTitle: 'Home', key: 'img', lang: 'en', tag: 'image2' },
      order: [['index', 'ASC']],
      raw: true,
    })

    expect(image2Content).toHaveLength(2)
    expect(
      image2Content.map((c) => ({ index: c.index, value: c.value })),
    ).toEqual([
      { index: 0, value: '888' },
      { index: 1, value: '999' },
    ])
  })

  test('POST: Successfully uploads multiple tagged images with correct indexing', async () => {
    const mockFileContent = Buffer.from('test')
    const formData1 = new FormData(),
      formData2 = new FormData()
    const mockFile1 = new File([mockFileContent], 'test1.jpg', {
      type: 'image/jpeg',
    })
    const mockFile2 = new File([mockFileContent], 'test2.jpg', {
      type: 'image/jpeg',
    })

    formData1.append('file', mockFile1)
    formData1.append('lang', 'en')
    formData1.append('key', 'testKey')
    formData1.append('pageTitle', 'Home')
    formData1.append('index', '0')
    formData1.append('tag', 'image1')

    formData2.append('file', mockFile2)
    formData2.append('lang', 'en')
    formData2.append('key', 'testKey')
    formData2.append('pageTitle', 'Home')
    formData2.append('index', '1')
    formData2.append('tag', 'image1')

    const response1 = await MEDIA_POST({
      request: {
        headers: { get: (name) => (name === 'content-length' ? '4' : null) },
        formData: () => Promise.resolve(formData1),
      },
    })

    const response2 = await MEDIA_POST({
      request: {
        headers: { get: (name) => (name === 'content-length' ? '4' : null) },
        formData: () => Promise.resolve(formData2),
      },
    })

    expect(response1.status).toBe(201)
    expect(response2.status).toBe(201)

    const content = await Content.findAll({
      where: {
        pageTitle: 'Home',
        key: 'testKey',
        tag: 'image1',
      },
      order: [['index', 'ASC']],
      raw: true,
    })

    expect(content).toHaveLength(2)
    expect(content[0].index).toBe(0)
    expect(content[1].index).toBe(1)
    expect(content[0].tag).toBe('image1')
    expect(content[1].tag).toBe('image1')
  })
})
