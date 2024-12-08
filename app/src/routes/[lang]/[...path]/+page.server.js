import { getAllPages, getPageBySlug } from '$lib/services/pageService.js'
import { getServerLang } from '$lib/server/lang.js'
import { getPageContent } from '$lib/server/pageContent.js'

const CONFIG = {
  INCLUDE_PUBLISHED_ONLY: false,
  NO_MATCHING_PAGE_RESULT: { page: null },
}

const findMatchingPage = (fullPath, pages) =>
  pages
    .filter((p) => fullPath.startsWith(p.slug))
    .sort((a, b) => b.slug.length - a.slug.length)[0]

const generateRouteParams = (fullPath, page) =>
  Object.fromEntries(
    (page.paramSchema || []).map((name, i) => [
      name,
      fullPath.slice(page.slug.length).split('/').filter(Boolean)[i] || null,
    ]),
  )

export async function load({ params }) {
  const pages = await getAllPages(CONFIG.INCLUDE_PUBLISHED_ONLY)
  const matchingPage = findMatchingPage(params.path, pages)
  if (!matchingPage) return CONFIG.NO_MATCHING_PAGE_RESULT

  const pageDetails = await getPageBySlug(matchingPage.slug)
  if (!pageDetails) return CONFIG.NO_MATCHING_PAGE_RESULT

  // Fetch needed content during SSR
  const extraContent = {
    Test: await getPageContent('Test'),
  }

  return {
    page: pageDetails,
    extraContent,
    routeParams: generateRouteParams(params.path, pageDetails),
  }
}
