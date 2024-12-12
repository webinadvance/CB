import { getServerLang } from '$lib/server/lang.js'
import { Page } from '$lib/database/models/page.js'
import { Content } from '$lib/database/models/content.js'

export async function getPageContent(pageTitle) {
  const lang = getServerLang() // Get the language from the server context

  const page = await Page.findOne({
    where: { pageTitle },
    include: [{ model: Content, as: 'contents' }],
    raw: false,
  })

  if (!page) {
    console.log('No page found for:', pageTitle)
    return null
  }

  const plainPage = page.get({ plain: true })

  // Reduce content to a transparent structure
  const contentData = plainPage.contents.reduce((acc, content) => {
    // Use the content matching the requested language, fallback to 'en'
    if (!acc[content.key] || content.lang === lang) {
      acc[content.key] = content.value
    }
    return acc
  }, {})

  return { ...plainPage, contentData }
}
