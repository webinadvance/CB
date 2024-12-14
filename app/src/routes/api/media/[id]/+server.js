import { json } from '@sveltejs/kit'
import { getMediaById, updateMedia } from '$lib/services/mediaService.js'
import { queryCache } from '$lib/cache/queryCache.js'
import { Content } from '$lib/database/models/content.js'
import { Media } from '$lib/database/models/media.js'
import sequelize from '$lib/database/config.js'

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

export async function DELETE({ params, request }) {
  const transaction = await sequelize.transaction()

  try {
    const body = await request.json()
    const { pageTitle, key, lang } = body

    const deletedMedia = await Media.destroy({
      where: { id: params.id },
      transaction,
    })

    if (pageTitle && key) {
      await Content.destroy({
        where: { pageTitle, key, lang },
        transaction,
      })
    }

    await transaction.commit()
    queryCache.flushAll()

    return json({ success: true })
  } catch (error) {
    await transaction.rollback()
    return json({ error: error.message }, { status: 500 })
  }
}
