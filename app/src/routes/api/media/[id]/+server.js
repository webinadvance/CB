import { json } from '@sveltejs/kit'
import {
  getMediaById,
  updateMedia,
  deleteMedia,
} from '$lib/services/mediaService.js'

export async function GET({ params }) {
  try {
    const media = await getMediaById(parseInt(params.id))
    if (!media) {
      return new Response('Media not found', { status: 404 })
    }
    return json(media)
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}

export async function PUT({ params, request }) {
  try {
    const mediaData = await request.json()
    const updatedMedia = await updateMedia(parseInt(params.id), mediaData)

    if (!updatedMedia) {
      return new Response('Media not found', { status: 404 })
    }

    return json(updatedMedia)
  } catch (error) {
    return json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE({ params }) {
  try {
    const success = await deleteMedia(parseInt(params.id))

    if (!success) {
      return new Response('Media not found', { status: 404 })
    }

    return new Response(null, { status: 204 })
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}
