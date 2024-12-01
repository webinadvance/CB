import { Router } from 'express'
import { Page } from '../database/models/page.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const whereClause =
      req.query.publishedOnly === 'true' ? { isPublished: true } : {}
    const pages = await Page.findAll({ where: whereClause })
    res.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:slug(*)', async (req, res) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug, isPublished: true },
    })
    if (!page) return res.status(404).json({ message: 'Page not found' })
    res.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
