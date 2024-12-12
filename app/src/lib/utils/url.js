import { pageSlugs } from '$lib/stores/pageStore.js'
import { langStore } from '$lib/stores/langStore.js'
import { get } from 'svelte/store'

export function buildPageUrl(pageTitle, params = {}) {
  const slugs = get(pageSlugs)
  const slug = slugs[pageTitle] || ''
  const lang = get(langStore)

  let url = `/${lang}`
  if (slug) url += `/${slug}`
  const paramValues = Object.values(params)
  if (paramValues.length) url += `/${paramValues.join('/')}`
  return url
}
