import { config } from 'dotenv'
config()

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
  const { VITE_API_BASE_URL } = process.env
  const fullPath = params.path

  // Fetch all pages first to check against available slugs
  const response = await fetch(`${VITE_API_BASE_URL}/api/pages`)
  if (!response.ok) {
    console.log('response', response)
    return { page: null }
  }

  const pages = await response.json()

  // Find the page with the longest matching slug that is at the start of the full path
  const matchingPage = pages
    .filter((page) => fullPath.startsWith(page.slug))
    .sort((a, b) => b.slug.length - a.slug.length)[0]

  if (!matchingPage) {
    return { page: null }
  }

  // Fetch the full page data for the matching slug
  const pageResponse = await fetch(
    `${VITE_API_BASE_URL}/api/pages/${matchingPage.slug}`,
  )
  if (!pageResponse.ok) {
    return { page: null }
  }

  const page = await pageResponse.json()

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
