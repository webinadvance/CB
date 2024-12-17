import { json } from '@sveltejs/kit'
import { Content } from '$lib/database/models/content.js'
import sequelize from '$lib/database/config.js'

export async function POST({ request }) {
  const { pageTitle, key, startIndex, endIndex, tag } = await request.json()

  await sequelize.transaction(async (t) => {
    const where = { pageTitle, baseKey: key }
    if (tag) where.tag = tag

    await Content.update(
      { index: -startIndex - 1 },
      { where: { ...where, index: startIndex }, transaction: t },
    )

    await Content.update(
      { index: -endIndex - 1 },
      { where: { ...where, index: endIndex }, transaction: t },
    )

    await Content.update(
      { index: startIndex },
      { where: { ...where, index: -endIndex - 1 }, transaction: t },
    )

    await Content.update(
      { index: endIndex },
      { where: { ...where, index: -startIndex - 1 }, transaction: t },
    )
  })

  return json({ success: true })
}
