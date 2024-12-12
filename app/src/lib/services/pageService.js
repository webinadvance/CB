import { Page } from '$lib/database/models/page.js'
import { getServerLang } from '$lib/server/lang.js'
import { Content } from '$lib/database/models/content.js'

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
    include: [{ model: Content, as: 'contents' }],
    raw: false,
  })

  if (!page) return null

  const plainPage = page.get({ plain: true })
  const contentData = plainPage.contents.reduce(
    (acc, content) => ({
      ...acc,
      [content.key]: content.value,
    }),
    {},
  )

  return { ...plainPage, contentData: localizeContent(contentData) }
}

export const getAllPages = async (publishedOnly) => {
  const pages = await Page.findAll({
    where: publishedOnly === 'true' ? { isPublished: true } : {},
    include: [{ model: Content, as: 'contents' }],
    raw: false,
  })

  return pages.map((page) => {
    const plainPage = page.get({ plain: true })
    const contentData = plainPage.contents.reduce(
      (acc, content) => ({
        ...acc,
        [content.key]: content.value,
      }),
      {},
    )

    return { ...plainPage, contentData: localizeContent(contentData) }
  })
}
