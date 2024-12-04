import sharp from 'sharp'
import { Media } from '$lib/database/models/media.js'

export async function GET({ params }) {
  const { id } = params
  try {
    const media = await Media.findByPk(parseInt(id), { raw: false })
    if (!media) return new Response('Media not found', { status: 404 })

    let content = media.content
    if (media.mimeType.startsWith('image/') && params.width) {
      content = await sharp(media.content)
        .resize(parseInt(params.width), null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 60 })
        .toBuffer()
    }

    return new Response(content, {
      headers: {
        'Content-Type': params.width ? 'image/jpeg' : media.mimeType,
        'Content-Length': content.length.toString(),
        'Cache-Control': 'public, max-age=31536000',
        'Content-Disposition': `inline; filename="${params.width ? 'preview_' : ''}${media.filename}"`,
      },
    })
  } catch (error) {
    console.error('Error serving media:', error)
    return new Response('Error serving file', { status: 500 })
  }
}
