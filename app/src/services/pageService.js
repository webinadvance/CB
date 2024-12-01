import { Page } from '../database/models/page.js'

async function getAllPages(publishedOnly) {
  const whereClause = publishedOnly === 'true' ? { isPublished: true } : {}
  return await Page.findAll({ where: whereClause })
}

async function getPageBySlug(slug) {
  return await Page.findOne({ where: { slug, isPublished: true } })
}

export { getAllPages, getPageBySlug }
