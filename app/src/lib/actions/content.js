import { getContext, setContext } from 'svelte'

const CONTENT_KEY = Symbol()
const PAGES_KEY = Symbol()

export function setContent(currentPage, allPages = []) {
  // Create a map of page titles to their content for quick lookup
  const pagesMap = new Map(
    allPages.map((page) => [page.title, page.contentData]),
  )

  const getContent = (key, pageTitle = null) => {
    if (!pageTitle) {
      return currentPage?.contentData?.[key] || ''
    }

    const pageContent = pagesMap.get(pageTitle)
    return pageContent?.[key] || ''
  }

  setContext(CONTENT_KEY, getContent)
  setContext(PAGES_KEY, pagesMap)
  return getContent
}

export function getContent() {
  return getContext(CONTENT_KEY)
}
