import { Page } from '$lib/database/models/page.js'

const parsePageData = (page) => ({
  ...page,
  contentData: JSON.parse(page.contentData || '{}'),
  paramSchema: JSON.parse(page.paramSchema || '[]'),
})

export const getAllPages = async (publishedOnly) =>
  (
    await Page.findAll({
      where: publishedOnly === 'true' ? { isPublished: true } : {},
      raw: true,
    })
  ).map(parsePageData)

export const getPageBySlug = async (slug) => {
  const page = await Page.findOne({
    where: { slug, isPublished: true },
    raw: true,
  })
  return page ? parsePageData(page) : null
}
