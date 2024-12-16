// FILE: app/src/lib/components/ECText.test.js
import { describe, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/svelte'
import ECText from './ECText.svelte'

vi.mock('$app/environment', () => ({ browser: true }))

let mockStoreSubscriber = null

vi.mock('$lib/stores/pageStore', () => ({
  pageData: {
    subscribe: (fn) => {
      mockStoreSubscriber = fn
      fn({ contentData: {} })
      return () => {}
    },
    update: vi.fn(),
  },
}))

vi.mock('$lib/stores/langStore', () => ({ langStore: 'en' }))
vi.mock('$lib/stores/editorStore', () => ({
  isEditable: {
    subscribe: (fn) => {
      fn(false)
      return () => {}
    },
  },
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

test('renders placeholder when empty', () => {
  const { container } = render(ECText, { props: { key: 'myKey' } })
  expect(container.textContent).toBe('Content not found')
})

test('updates content from store', async () => {
  const { container } = render(ECText, { props: { key: 'myKey' } })
  await vi.dynamicImportSettled()

  mockStoreSubscriber({ contentData: { myKey: 'New Content' } })
  await Promise.resolve() // Wait for reactive update

  expect(container.textContent).toBe('New Content')
})
