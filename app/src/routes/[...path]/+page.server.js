import { getAllPages, getPageBySlug } from '$lib/services/pageService.js'

// Configuration Variables
const CONFIG = {
  INCLUDE_PUBLISHED_ONLY: false,
  NO_MATCHING_PAGE_RESULT: { page: null },
}

// Main Load Function
export async function load({ params }) {
  const fullPath = params.path
  const pages = await fetchAllPages(CONFIG.INCLUDE_PUBLISHED_ONLY)
  const matchingPage = locateMatchingPage(fullPath, pages)

  if (!matchingPage) {
    return CONFIG.NO_MATCHING_PAGE_RESULT
  }

  const pageDetails = await fetchPageDetailsBySlug(matchingPage.slug)

  if (!pageDetails) {
    return CONFIG.NO_MATCHING_PAGE_RESULT
  }

  const routeParameters = deriveRouteParams(fullPath, pageDetails)
  return { page: pageDetails, routeParams: routeParameters }
}

// Fetch All Pages
async function fetchAllPages(includePublishedOnly) {
  return getAllPages(includePublishedOnly)
}

// Locate Matching Page
function locateMatchingPage(fullPath, pages) {
  return pages
    .filter((page) => fullPath.startsWith(page.slug))
    .sort((a, b) => b.slug.length - a.slug.length)[0]
}

// Fetch Page Details by Slug
async function fetchPageDetailsBySlug(slug) {
  return getPageBySlug(slug)
}

// Derive Route Parameters
function deriveRouteParams(fullPath, page) {
  const remainingPathSegments = fullPath
    .slice(page.slug.length)
    .split('/')
    .filter(Boolean)

  return Object.fromEntries(
    (page.paramSchema || []).map((name, index) => [
      name,
      remainingPathSegments[index] || null,
    ]),
  )
}
