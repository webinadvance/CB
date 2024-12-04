import { json } from '@sveltejs/kit'
import { getAllMedia, createMedia } from '$lib/services/mediaService.js'

export async function GET({ url }) {
  const publicOnly = url.searchParams.get('publicOnly') !== 'false'
  const media = await getAllMedia(publicOnly)
  return json(media)
}

export async function POST({ request }) {
  try {
    const mediaData = await request.json()
    const newMedia = await createMedia(mediaData)
    return json(newMedia, { status: 201 })
  } catch (error) {
    return json({ error: error.message }, { status: 400 })
  }
}
