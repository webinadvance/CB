import { Page } from '$lib/database/models/page.js'
import { getServerLang } from '$lib/server/lang.js'

const localizeContent = (contentData) => {
  const lang = getServerLang()
  return Object.fromEntries(
    Object.entries(contentData).map(([key, content]) => [
      key,
      typeof content === 'object'
        ? content[lang] || content['en'] || ''
        : content,
    ]),
  )
}

const parsePageData = (page) => ({
  ...page,
  contentData: localizeContent(JSON.parse(page.contentData || '{}')),
  paramSchema: JSON.parse(page.paramSchema || '[]'),
})

export const getPageBySlug = async (slug) => {
  const page = await Page.findOne({
    where: { slug, isPublished: true },
    raw: true,
  })
  return page ? parsePageData(page) : null
}

export const getAllPages = async (publishedOnly) => {
  const pages = await Page.findAll({
    where: publishedOnly === 'true' ? { isPublished: true } : {},
    raw: true,
  })
  return pages.map(parsePageData)
}
