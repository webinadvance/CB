import { getAllPages, getPageBySlug } from '$lib/services/pageService.js'

const CONFIG = {
  INCLUDE_PUBLISHED_ONLY: false,
  NO_MATCHING_PAGE_RESULT: { page: null },
}

async function retrieveAllPages(includePublishedOnly) {
  return await getAllPages(includePublishedOnly)
}

function isPathMatching(fullPath, slug) {
  return fullPath.startsWith(slug)
}

function compareSlugLengthDescending(a, b) {
  return b.slug.length - a.slug.length
}

function findMatchingPage(fullPath, pages) {
  return pages
    .filter((page) => isPathMatching(fullPath, page.slug))
    .sort(compareSlugLengthDescending)[0]
}

function getParameter(fullPath, page, index) {
  return (
    fullPath.slice(page.slug.length).split('/').filter(Boolean)[index] || null
  )
}

function generateRouteParams(fullPath, page) {
  return Object.fromEntries(
    (page.paramSchema || []).map((name, index) => [
      name,
      getParameter(fullPath, page, index),
    ]),
  )
}

export async function load({ params }) {
  const pages = await retrieveAllPages(CONFIG.INCLUDE_PUBLISHED_ONLY)
  const matchingPage = findMatchingPage(params.path, pages)

  if (!matchingPage) {
    return CONFIG.NO_MATCHING_PAGE_RESULT
  }

  const pageDetails = await getPageBySlug(matchingPage.slug)

  if (!pageDetails) {
    return CONFIG.NO_MATCHING_PAGE_RESULT
  }

  return {
    page: pageDetails,
    routeParams: generateRouteParams(params.path, pageDetails),
  }
}
