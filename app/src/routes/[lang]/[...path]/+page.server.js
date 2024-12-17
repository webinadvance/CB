import {
  getAllPages,
  getPageBySlug,
  localizeContent,
} from '$lib/services/pageService.js'
import { getPageContent } from '$lib/server/pageContent.js'
import { componentDependencies } from '$lib/utils/dependencies.js'
import { setServerLang } from '$lib/server/lang.js'

const findMatchingPage = (fullPath, pages) =>
  pages
    .filter((p) => fullPath.startsWith(p.slug))
    .sort((a, b) => b.slug.length - a.slug.length)[0]

const generateRouteParams = (fullPath, page) =>
  Object.fromEntries(
    (page.paramSchema || []).map((name, i) => [
      name,
      fullPath
        .replace(page.slug, '')
        .replace(/^\/+|\/+$/g, '')
        .split('/')[i] || null,
    ]),
  )

export async function load({ params, url }) {
  setServerLang(
    ['en', 'it', 'fr', 'es'].includes(params.lang) ? params.lang : 'en',
  )
  const pages = await getAllPages()
  const matchingPage = findMatchingPage(params.path, pages)
  if (!matchingPage) return { page: null }
  const pageDetails = await getPageBySlug(matchingPage.slug)
  if (!pageDetails) return { page: null }
  const extraContent = {}
  for (const title of componentDependencies[pageDetails.componentName] || []) {
    const content = await getPageContent(title)
    extraContent[title] = content ? content.contentData : {}
  }
  for (const param of url.searchParams.getAll('extraKeys[]')) {
    const { pageTitle } = JSON.parse(param)
    const content = await getPageContent(pageTitle)
    if (content) extraContent[pageTitle] = localizeContent(content.contents)
  }
  return {
    page: {
      ...pageDetails,
      extraContent,
      routeParams: generateRouteParams(params.path, pageDetails),
    },
    slugs: Object.fromEntries(pages.map((p) => [p.pageTitle, p.slug])),
  }
}
