import { Media } from '$lib/database/models/media.js'

export async function GET({ params }) {
  try {
    const media = await Media.findByPk(parseInt(params.id), {
      raw: false, // Need the model instance to get BLOB data
    })

    if (!media) {
      return new Response('Media not found', { status: 404 })
    }

    const headers = {
      'Content-Type': media.mimeType,
      'Content-Length': media.size.toString(),
      'Cache-Control': 'public, max-age=31536000',
      'Content-Disposition': `inline; filename="${media.filename}"`,
    }

    return new Response(media.content, { headers })
  } catch (error) {
    console.error('Error serving media:', error)
    return new Response('Error serving file', { status: 500 })
  }
}
