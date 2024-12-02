// src/routes/[...path]/+page.server.js
import { getAllPages, getPageBySlug } from '$lib/services/pageService.js'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const fullPath = params.path

  // Get pages directly from service
  const pages = await getAllPages(false)

  // Find the page with the longest matching slug that is at the start of the full path
  const matchingPage = pages
    .filter((page) => fullPath.startsWith(page.slug))
    .sort((a, b) => b.slug.length - a.slug.length)[0]

  if (!matchingPage) {
    return { page: null }
  }

  // Get full page data directly from service
  const page = await getPageBySlug(matchingPage.slug)

  if (!page) {
    return { page: null }
  }

  // Calculate remaining path segments after the slug
  const remainingPath = fullPath
    .slice(page.slug.length)
    .split('/')
    .filter(Boolean)

  // Map remaining segments to paramSchema values
  const routeParams = Object.fromEntries(
    (page.paramSchema || []).map((name, index) => [
      name,
      remainingPath[index] || null,
    ]),
  )

  return { page, routeParams }
}
