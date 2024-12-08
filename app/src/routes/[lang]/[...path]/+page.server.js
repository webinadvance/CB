import { getAllPages, getPageBySlug } from '$lib/services/pageService.js'
import { getPageContent } from '$lib/server/pageContent.js'
import { componentDependencies } from '$lib/utils/dependencies.js'

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

  console.log('-------------------', params.path)
  console.log('-------------------', matchingPage)

  if (!matchingPage) return CONFIG.NO_MATCHING_PAGE_RESULT

  const pageDetails = await getPageBySlug(matchingPage.slug)

  if (!pageDetails) return CONFIG.NO_MATCHING_PAGE_RESULT

  // Get required pages for this component
  const neededPages = componentDependencies[pageDetails.componentName] || []

  // Fetch only the needed content
  const extraContent = Object.fromEntries(
    await Promise.all(
      neededPages.map(async (title) => [title, await getPageContent(title)]),
    ),
  )

  return {
    page: pageDetails,
    extraContent,
    routeParams: generateRouteParams(params.path, pageDetails),
  }
}
