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

export const getPageBySlug = async (slug) => {
  const page = await Page.findOne({
    where: { slug },
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

export const getAllPages = async () => {
  const pages = await Page.findAll({
    where: {},
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
