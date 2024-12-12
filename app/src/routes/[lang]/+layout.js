import { langStore } from '$lib/stores/langStore'

export const load = ({ data }) => {
  langStore.set(data.lang)
  return {
    lang: data.lang,
  }
}
