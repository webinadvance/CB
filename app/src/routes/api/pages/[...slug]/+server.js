import { json } from '@sveltejs/kit'
import { getPageBySlug } from '$lib/services/pageService.js'

export async function GET({ params }) {
  const page = await getPageBySlug(params.slug)
  if (!page) {
    return new Response('Page not found', { status: 404 })
  }
  return json(page)
}
