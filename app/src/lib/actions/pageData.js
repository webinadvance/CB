import { getContext, setContext } from 'svelte'

const PAGE_DATA_KEY = Symbol()

export function setPageData(data = {}) {
  setContext(PAGE_DATA_KEY, data)
}

export function getPageData() {
  return getContext(PAGE_DATA_KEY)
}
