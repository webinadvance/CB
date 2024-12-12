import { getServerLang } from '$lib/server/lang.js'
import { Page } from '$lib/database/models/page.js'
import { Content } from '$lib/database/models/content.js'

export async function getPageContent(pageTitle) {
  const lang = getServerLang()

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

  const contentData = plainPage.contents.reduce(
    (acc, content) => ({
      ...acc,
      [content.key]: content.value[lang] || content.value['en'] || '',
    }),
    {},
  )
  
  return { ...plainPage, contentData }
}
