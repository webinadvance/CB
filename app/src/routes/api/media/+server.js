import { json } from '@sveltejs/kit'
import { getAllMedia, createMedia } from '$lib/services/mediaService.js'
import { Media } from '$lib/database/models/media.js'
import { queryCache } from '$lib/cache/queryCache.js'
import { Content } from '$lib/database/models/content.js'
import sequelize from '$lib/database/config.js'

export async function GET({ url }) {
  const publicOnly = url.searchParams.get('publicOnly') !== 'false'
  const media = await getAllMedia(publicOnly)
  return json(media)
}

export async function POST({ request }) {
  const transaction = await sequelize.transaction()

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const lang = formData.get('lang')
    const key = formData.get('key')
    const pageTitle = formData.get('pageTitle')

    if (!file) {
      return json({ error: 'No file uploaded' }, { status: 400 })
    }

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

    if (key && pageTitle) {
      await Content.upsert(
        {
          pageTitle,
          key,
          value: media.id.toString(),
          lang,
        },
        { transaction },
      )
    }

    await transaction.commit()
    queryCache.flushAll()

    return json({ id: media.id })
  } catch (error) {
    await transaction.rollback()
    return json({ error: error.message }, { status: 500 })
  }
}
