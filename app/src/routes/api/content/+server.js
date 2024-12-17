import { json } from '@sveltejs/kit'
import { Content } from '$lib/database/models/content.js'
import { get } from 'svelte/store'
import { langStore } from '$lib/stores/langStore.js'
import sequelize from '$lib/database/config.js'
import { Op } from 'sequelize'

export async function POST({ request }) {
  const payload = await request.json()
  const { pageTitle, key, tag = null, index = null, value } = payload
  const lang = payload.lang || get(langStore)

  if (!pageTitle || !key)
    return json({ error: 'Missing required fields' }, { status: 400 })

  const where = { pageTitle, key, tag, index, lang }
  const existing = await Content.findOne({ where })

  const result = existing
    ? await existing.update({ value })
    : await Content.create({ ...where, value })

  return json(result, { status: existing ? 200 : 201 })
}

export async function DELETE({ request }) {
  const {
    pageTitle,
    key,
    tag,
    index,
    lang: requestLang,
    strict = false,
  } = await request.json()
  const lang = requestLang || get(langStore)

  if (!pageTitle || !key) {
    return json({ error: 'Missing required fields' }, { status: 400 })
  }

  await sequelize.transaction(async (t) => {
    const where = { pageTitle, key: key, lang }

    if (typeof index === 'number') {
      where.index = index
      if (!strict) {
        where.tag = tag
      }
      await Content.destroy({ where, transaction: t })

      // Reindex for each tag separately
      const tags = strict
        ? await Content.findAll({
            attributes: ['tag'],
            where: { pageTitle, key: key, lang },
            group: ['tag'],
            raw: true,
          })
        : [{ tag }]

      for (const { tag } of tags) {
        const remainingItems = await Content.findAll({
          where: {
            pageTitle,
            key: key,
            tag,
            index: { [Op.gt]: index },
            lang,
          },
          order: [['index', 'ASC']],
          transaction: t,
        })

        for (const item of remainingItems) {
          await item.update({ index: item.index - 1 }, { transaction: t })
        }
      }
    } else {
      if (tag !== undefined) {
        where.tag = tag
      }
      await Content.destroy({ where, transaction: t })
    }
  })

  return new Response(null, { status: 204 })
}
