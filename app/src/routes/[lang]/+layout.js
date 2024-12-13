import { langStore } from '$lib/stores/langStore'

export const load = ({ data }) => {
  if (data.lang === 'it' || data.lang === 'en') {
    langStore.set(data.lang)
  }
  return {
    lang: data.lang,
  }
}
