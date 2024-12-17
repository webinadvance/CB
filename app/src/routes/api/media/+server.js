import { json } from '@sveltejs/kit'
import { getAllMedia } from '$lib/services/mediaService.js'
import { Media } from '$lib/database/models/media.js'
import { POST as saveContent } from '../content/+server.js'

export async function GET({ url }) {
  return json(await getAllMedia(url.searchParams.get('publicOnly') !== 'false'))
}

export async function POST({ request }) {
  const formData = await request.formData()
  const file = formData.get('file')
  if (!file) return json({ error: 'No file uploaded' }, { status: 400 })

  const lang = formData.get('lang')

  try {
    const buffer = await file.arrayBuffer()
    const media = await Media.create({
      content: Buffer.from(buffer),
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      lang,
    })

    return json({ id: media.id }, { status: 201 })
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}
