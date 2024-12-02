import { json } from '@sveltejs/kit'
import { getAllPages, getPageBySlug } from '$lib/services/pageService.js'

export async function GET({ url }) {
  const publishedOnly = url.searchParams.get('publishedOnly')
  const pages = await getAllPages(publishedOnly)
  return json(pages)
}
