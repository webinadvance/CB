import { i18n } from '$lib/i18n'

export function getContent() {
  return (key) => {
    const content = i18n.content[key]?.content || {}
    const result = content[i18n.language] || content.en || ''
    return result
  }
}

export function setContent(data) {
  i18n.content = data
}
