// FILE: app/src/lib/components/ECText.test.js
import { describe, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/svelte' // Added render import
import ECText from './ECText.svelte'

vi.mock('$app/environment', () => ({ browser: true }))

vi.mock('$lib/stores/pageStore', () => ({
  pageData: {
    subscribe: (fn) => {
      fn({
        contentData: { testKey: 'Test Content' },
        extraContent: { testPage: { testKey: 'Extra Content' } },
      })
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

afterEach(cleanup)

test('component exists', () => {
  expect(ECText).toBeTruthy()
})

test('renders contentData', async () => {
  await vi.dynamicImportSettled()
  const { container } = render(ECText, { props: { key: 'testKey' } })
  expect(container).toBeTruthy()
})

test('renders custom content', async () => {
  vi.mock('$lib/stores/pageStore', () => ({
    pageData: {
      subscribe: (fn) => {
        fn({
          contentData: {
            myKey: 'testData',
          },
        })
        return () => {}
      },
      update: vi.fn(),
    },
  }))

  const { container } = render(ECText, { props: { key: 'myKey' } })
  expect(container.textContent).toBe('testData')
})
