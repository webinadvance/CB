import {
  getAllPages,
  getPageBySlug,
  localizeContent,
} from '$lib/services/pageService.js'
import { getPageContent } from '$lib/server/pageContent.js'
import { componentDependencies } from '$lib/utils/dependencies.js'
import { setServerLang } from '$lib/server/lang.js'

const CONFIG = {
  NO_MATCHING_PAGE_RESULT: { page: null },
}

const findMatchingPage = (fullPath, pages) =>
  pages
    .filter((p) => fullPath.startsWith(p.slug))
    .sort((a, b) => b.slug.length - a.slug.length)[0]

const generateRouteParams = (fullPath, page) => {
  // fullPath is 'aaa/bbb/sss', page.slug is 'aaa/bbb'
  // We need to remove leading/trailing slashes to handle paths properly
  const pathAfterSlug = fullPath
    .replace(page.slug, '') // removes 'aaa/bbb', leaves '/sss'
    .replace(/^\/+|\/+$/g, '') // removes leading/trailing slashes
    .split('/') // ['sss']

  return Object.fromEntries(
    (page.paramSchema || []).map((name, i) => [name, pathAfterSlug[i] || null]),
  )
}
export async function load({ params, url }) {
  const lang = ['en', 'it', 'fr', 'es'].includes(params.lang)
    ? params.lang
    : 'en'

  setServerLang(lang)

  const pages = await getAllPages()
  const slugMapping = Object.fromEntries(
    pages.map((p) => [p.pageTitle, p.slug]),
  )
  const matchingPage = findMatchingPage(params.path, pages)

  if (!matchingPage) return CONFIG.NO_MATCHING_PAGE_RESULT

  const pageDetails = await getPageBySlug(matchingPage.slug)
  if (!pageDetails) return CONFIG.NO_MATCHING_PAGE_RESULT

  const extraContent = {}
  for (const pageTitle of componentDependencies[pageDetails.componentName] ||
    []) {
    const content = await getPageContent(pageTitle)
    extraContent[pageTitle] = content ? content.contentData : {}
  }

  const extraKeys = url.searchParams.getAll('extraKeys[]')
  for (const keyParam of extraKeys) {
    try {
      const { pageTitle } = JSON.parse(keyParam)
      const content = await getPageContent(pageTitle)
      if (content) {
        extraContent[pageTitle] = localizeContent(content.contents)
      }
    } catch (e) {
      console.error('Invalid extraKeys format:', keyParam)
    }
  }

  return {
    page: {
      ...pageDetails,
      extraContent,
      routeParams: generateRouteParams(params.path, pageDetails),
    },
    slugs: slugMapping,
  }
}
