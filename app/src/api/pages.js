import { Router } from 'express'
import { getAllPages, getPageBySlug } from '../services/pageService.js'

const router = Router()

router.get('/', async (req, res) => {
  const pages = await getAllPages(req.query.publishedOnly)
  res.json(pages)
})

router.get('/:slug(*)', async (req, res) => {
  const page = await getPageBySlug(req.params.slug)
  if (!page) return res.status(404).json({ message: 'Page not found' })
  res.json(page)
})

export default router
