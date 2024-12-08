import { json } from '@sveltejs/kit'
import { Page } from '$lib/database/models/page.js'

export async function GET({ params }) {
  const page = await Page.findOne({
    where: { title: params.title, isPublished: true },
    raw: true,
  })
  return json(page?.contentData || {})
}
