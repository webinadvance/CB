// src/lib/services/pageService.js
import { Page } from '$lib/database/models/page.js'

async function getAllPages(publishedOnly) {
  const whereClause = publishedOnly === 'true' ? { isPublished: true } : {}
  const pages = await Page.findAll({
    where: whereClause,
    raw: true,
  })

  // Parse JSON fields manually
  return pages.map((page) => ({
    ...page,
    contentData: JSON.parse(page.contentData || '{}'),
    paramSchema: JSON.parse(page.paramSchema || '[]'),
  }))
}

async function getPageBySlug(slug) {
  const page = await Page.findOne({
    where: { slug, isPublished: true },
    raw: true,
  })

  if (!page) return null

  // Parse JSON fields manually
  return {
    ...page,
    contentData: JSON.parse(page.contentData || '{}'),
    paramSchema: JSON.parse(page.paramSchema || '[]'),
  }
}

export { getAllPages, getPageBySlug }
