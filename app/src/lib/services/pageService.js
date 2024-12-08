import { Page } from '$lib/database/models/page.js'
import { getServerLang } from '$lib/server/lang.js'
const localizeContent = (contentData) => {
  const lang = getServerLang()
  const localizedContent = {}

  for (const key in contentData) {
    const content = contentData[key]
    localizedContent[key] =
      typeof content === 'object'
        ? content[lang] || content['en'] || ''
        : content
  }

  return localizedContent
}

const parsePageData = (page) => {
  const parsedPage = {
    ...page,
    contentData: JSON.parse(page.contentData || '{}'),
    paramSchema: JSON.parse(page.paramSchema || '[]'),
  }

  parsedPage.contentData = localizeContent(parsedPage.contentData)

  return parsedPage
}

export const getPageBySlug = async (slug) => {
  const page = await Page.findOne({
    where: { slug, isPublished: true },
    raw: true,
  })
  return page ? parsePageData(page) : null
}

export const getAllPages = async (publishedOnly) =>
  (
    await Page.findAll({
      where: publishedOnly === 'true' ? { isPublished: true } : {},
      raw: true,
    })
  ).map(parsePageData)
