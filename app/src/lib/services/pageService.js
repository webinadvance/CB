import { Page } from '$lib/database/models/page.js'
import { Content } from '$lib/database/models/content.js'
import { getServerLang } from '$lib/server/lang.js'
import { cachedQuery } from '$lib/cache/queryCache.js'

const localizeContent = (contents) => {
  const lang = getServerLang()
  const contentData = {}

  contents.forEach((content) => {
    if (!contentData[content.key]) {
      contentData[content.key] = {}
    }

    if (content.index !== null) {
      if (!contentData[content.key][content.index]) {
        contentData[content.key][content.index] = {}
      }
      contentData[content.key][content.index][content.tag || 'value'] =
        content.value
    } else {
      contentData[content.key] = content.value
    }
  })

  return contentData
}

export const getPageBySlug = async (slug) => {
  const lang = getServerLang()

  return await cachedQuery(`pageBySlug:${slug}:${lang}`, async () => {
    const page = await Page.findOne({
      where: { slug },
      include: [{ model: Content, as: 'contents' }],
      raw: false,
    })

    if (!page) return null

    const plainPage = page.get({ plain: true })
    const contentData = localizeContent(plainPage.contents)

    const { contents, ...pageWithoutContents } = plainPage
    return { ...pageWithoutContents, contentData }
  })
}

export const getAllPages = async () => {
  const lang = getServerLang()

  return await cachedQuery(`allPages:${lang}`, async () => {
    const pages = await Page.findAll({
      include: [{ model: Content, as: 'contents' }],
      raw: false,
    })

    return pages.map((page) => {
      const plainPage = page.get({ plain: true })
      const contentData = localizeContent(plainPage.contents)

      return { ...plainPage, contentData }
    })
  })
}
