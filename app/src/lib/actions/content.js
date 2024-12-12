import { getContext, setContext } from 'svelte'

const CONTENT_KEY = Symbol()

export function setContent(page, getExtraContent) {
  const getContent = (key, pageTitle = null) => {
    if (pageTitle) {
      return getExtraContent(key, pageTitle)
    }
    return page?.contentData?.[key] || ''
  }

  setContext(CONTENT_KEY, getContent)
  return getContent
}

export function getContent() {
  return getContext(CONTENT_KEY)
}
