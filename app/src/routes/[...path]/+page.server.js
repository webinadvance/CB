import { getAllPages, getPageBySlug } from '$lib/services/pageService.js'

export async function load({ params }) {
  const fullPath = params.path
  const pages = await getAllPages(false)
  const matchingPage = pages
    .filter((page) => fullPath.startsWith(page.slug))
    .sort((a, b) => b.slug.length - a.slug.length)[0]

  if (!matchingPage) return { page: null }

  const page = await getPageBySlug(matchingPage.slug)
  if (!page) return { page: null }

  const remainingPath = fullPath
    .slice(page.slug.length)
    .split('/')
    .filter(Boolean)
  const routeParams = Object.fromEntries(
    (page.paramSchema || []).map((name, index) => [
      name,
      remainingPath[index] || null,
    ]),
  )

  return { page, routeParams }
}
