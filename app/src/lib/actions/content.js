import { getContext, setContext } from "svelte"
import { derived } from "svelte/store"
import { i18n } from "../i18n"

const CONTENT_KEY = Symbol()

export function setContent(page) {
  const getContent = (key) => {
    const content = page?.contentData?.[key]?.content || ""
    return content
  }
  setContext(CONTENT_KEY, getContent)
  return getContent
}

export function getContent() {
  return getContext(CONTENT_KEY)
}
