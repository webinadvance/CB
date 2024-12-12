import { getServerLang } from '$lib/server/lang.js'
import { Page } from '$lib/database/models/page.js'

export async function getPageContent(title) {
  const page = await Page.findOne({
    where: { title, isPublished: true },
    raw: true,
  })

  if (!page) return null

  const lang = getServerLang()
  return Object.fromEntries(
    Object.entries(JSON.parse(page.contentData || '{}')).map(
      ([key, content]) => [
        key,
        typeof content === 'object'
          ? content[lang] || content['en'] || ''
          : content,
      ],
    ),
  )
}
