import { json } from '@sveltejs/kit'
import { getMediaById, updateMedia } from '$lib/services/mediaService.js'
import { queryCache } from '$lib/cache/queryCache.js'
import { Media } from '$lib/database/models/media.js'
import { Content } from '$lib/database/models/content.js'
import sequelize from '$lib/database/config.js'
import { Op } from 'sequelize'
export async function GET({ params }) {
  const media = await getMediaById(parseInt(params.id))
  return media ? json(media) : new Response('Media not found', { status: 404 })
}
export async function PUT({ params, request }) {
  const updatedMedia = await updateMedia(
    parseInt(params.id),
    await request.json(),
  )
  return updatedMedia
    ? json(updatedMedia)
    : new Response('Media not found', { status: 404 })
}
export async function DELETE({ params, request }) {
  const { pageTitle, key, lang } = await request.json()
  await Media.destroy({ where: { id: params.id } })
  if (pageTitle && key) {
    const remainingItems = await Content.findAll({
      where: { pageTitle, key: { [Op.like]: `${key}.%` }, lang },
      order: [
        [
          sequelize.literal(
            `CAST(SUBSTRING([key], CHARINDEX('.', [key]) + 1, LEN([key])) AS INTEGER)`,
          ),
          'ASC',
        ],
      ],
    })
    for (let i = 0; i < remainingItems.length; i++)
      await remainingItems[i].update({ key: `${key}.${i}` })
  }
  queryCache.flushAll()
  return json({ success: true })
}
