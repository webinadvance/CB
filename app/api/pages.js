import { Router } from 'express'
import { getAllPages, getPageBySlug } from '../services/pageService.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const pages = await getAllPages(req.query.publishedOnly)
    res.json(pages)
  } catch (error) {
    next(error)
  }
})

router.get('/:slug(*)', async (req, res, next) => {
  try {
    const page = await getPageBySlug(req.params.slug)
    if (!page) return res.status(404).json({ message: 'Page not found' })
    res.json(page)
  } catch (error) {
    next(error)
  }
})

export default router
