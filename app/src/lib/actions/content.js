import { getContext, setContext } from 'svelte'

const CONTENT_KEY = Symbol()

export function setContent(page, lang = 'en') {
  const getContent = (key) => page?.contentData?.[key]?.content?.[lang] || ''
  setContext(CONTENT_KEY, getContent)
  return getContent
}

export function getContent() {
  return getContext(CONTENT_KEY)
}
