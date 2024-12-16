import { json } from '@sveltejs/kit'
import { Content } from '$lib/database/models/content.js'
import { Op } from 'sequelize'
import { get } from 'svelte/store'
import { langStore } from '$lib/stores/langStore.js'
import sequelize from '$lib/database/config.js'
import { queryCache } from '$lib/cache/queryCache.js'

export async function POST({ request }) {
  try {
    let { pageTitle, key, value, lang } = await request.json()

    lang = lang || get(langStore)

    if (!pageTitle || !key) {
      return json({ error: 'Missing fields: pageTitle, key' }, { status: 400 })
    }

    const [content, created] = await Content.upsert(
      { pageTitle, key, value, lang },
      { returning: true },
    )

    queryCache.flushAll()
    return json(content, { status: created ? 201 : 200 })
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE({ request }) {
  try {
    const body = await request.json()
    const { pageTitle, key, index, lang: requestLang } = body
    const lang = requestLang || get(langStore)
    const deletePattern = `${key}[[]%.${index}`
    const reindexPattern = `${key}[[]%.%`

    await sequelize.transaction(async (t) => {
      await Content.destroy({
        where: {
          pageTitle,
          key: { [Op.like]: deletePattern },
          lang,
        },
        transaction: t,
      })

      const remainingItems = await Content.findAll({
        where: {
          pageTitle,
          key: { [Op.like]: reindexPattern },
          lang,
        },
        order: [['key', 'ASC']],
        raw: true,
        transaction: t,
      })

      for (const item of remainingItems) {
        const regex = /^(.+?)\[(.+?)\]\.(\d+)$/
        const matches = item.key.match(regex)

        if (matches) {
          const [, baseKey, tag, oldIndexStr] = matches
          const oldIndex = Number(oldIndexStr)
          if (oldIndex > index) {
            const newIndex = oldIndex - 1
            const newKey = `${baseKey}[${tag}].${newIndex}`
            await Content.update(
              { key: newKey },
              { where: { id: item.id }, transaction: t },
            )
          }
        }
      }
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}
