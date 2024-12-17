import { json } from '@sveltejs/kit'
import { getAllMedia, createMedia } from '$lib/services/mediaService.js'
import { Media } from '$lib/database/models/media.js'
import sequelize from '$lib/database/config.js'
import { POST as saveContent } from '../content/+server.js'

export async function GET({ url }) {
  return json(await getAllMedia(url.searchParams.get('publicOnly') !== 'false'))
}

export async function POST({ request }) {
  const transaction = await sequelize.transaction()
  const contentLength = +request.headers.get('content-length') || 0
  if (contentLength > 50 * 1024 * 1024)
    return json({ error: 'File too large' }, { status: 413 })

  const formData = await request.formData()
  const file = formData.get('file')
  if (!file) return json({ error: 'No file uploaded' }, { status: 400 })

  const lang = formData.get('lang')
  const key = formData.get('key')
  const pageTitle = formData.get('pageTitle')
  const index = formData.get('index')

  try {
    const buffer = await file.arrayBuffer()
    const media = await Media.create(
      {
        content: Buffer.from(buffer),
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        lang,
      },
      { transaction },
    )

    // Pass index to saveContent
    await saveContent({
      request: {
        json: async () => ({
          pageTitle,
          key,
          value: media.id.toString(),
          lang,
          index: index ? parseInt(index) : null, // Handle index
        }),
      },
    })

    await transaction.commit()
    return json({ id: media.id })
  } catch (error) {
    await transaction.rollback()
    return json({ error: error.message }, { status: 500 })
  }
}
