import { describe, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/svelte'
import ECText from '$lib/components/ECText.svelte'

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
  expect(container.textContent).toBe('')
})
