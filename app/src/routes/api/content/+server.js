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

    if (!pageTitle || !key || typeof index !== 'number') {
      return json({ error: 'Invalid input parameters.' }, { status: 400 })
    }

    const hasBrackets = !!(await Content.findOne({
      where: { pageTitle, key: { [Op.like]: `${key}[%].%` }, lang },
      attributes: ['id'],
      raw: true,
    }))

    const escapedKey = key.replace(/[[\]]/g, (x) => (x === '[' ? '[[]' : '[]]'))
    const deletePattern = hasBrackets
      ? `${escapedKey}[%].${index}`
      : `${key}.${index}`
    const reindexPattern = hasBrackets ? `${escapedKey}[%].%` : `${key}.%`
    const deleteCondition = hasBrackets
      ? { [Op.like]: deletePattern }
      : { [Op.eq]: deletePattern }

    await sequelize.transaction(async (t) => {
      await Content.destroy({
        where: { pageTitle, key: deleteCondition, lang },
        transaction: t,
      })

      const remainingItems = await Content.findAll({
        where: { pageTitle, key: { [Op.like]: reindexPattern }, lang },
        order: [['key', 'ASC']],
        raw: true,
        transaction: t,
      })

      const regex = hasBrackets ? /^(.+?)\[(.+?)\]\.(\d+)$/ : /^(.+?)\.(\d+)$/

      for (const item of remainingItems) {
        const matches = item.key.match(regex)
        if (matches) {
          const [_, baseKey, tagOrIndex, oldIndex] = matches
          const newIndex = Number(oldIndex) - 1
          if (Number(oldIndex) > index) {
            const newKey = hasBrackets
              ? `${baseKey}[${tagOrIndex}].${newIndex}`
              : `${baseKey}.${newIndex}`
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
    console.log(error)
    return json({ error: error.message }, { status: 500 })
  }
}
