import { getContext, setContext } from 'svelte'

const PAGE_KEY = Symbol()

export function setPageContext(page) {
  setContext(PAGE_KEY, {
    data: page,
    getContent: (key, pageTitle) =>
      pageTitle
        ? page?.extraContent?.[pageTitle]?.[key] || ''
        : page?.contentData?.[key] || '',
  })
}

export function getPageContext() {
  return getContext(PAGE_KEY)
}
