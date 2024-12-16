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
    const { pageTitle, key, index, lang: requestLang } = await request.json()
    const lang = requestLang || get(langStore)

    if (!pageTitle || !key || typeof index !== 'number') {
      return json({ error: 'Invalid input parameters.' }, { status: 400 })
    }

    const hasBrackets = !!(await Content.findOne({
      where: { pageTitle, key: { [Op.like]: `${key}[%].%` }, lang },
      attributes: ['id'],
      raw: true,
    }))

    await sequelize.transaction(async (t) => {
      if (hasBrackets) {
        const bracketPattern = `${key}[%].${index}`
        await Content.destroy({
          where: { pageTitle, key: { [Op.like]: bracketPattern }, lang },
          transaction: t,
        })
      } else {
        const items = await Content.findAll({
          where: {
            pageTitle,
            key: { [Op.like]: `${key}.%` },
            lang,
          },
          order: [['key', 'ASC']],
          transaction: t,
        })

        const itemToDelete = items.find((item) => {
          const matches = item.key.match(/^(.+?)\.(\d+)$/)
          return matches && Number(matches[2]) === index
        })

        if (itemToDelete) {
          await Content.destroy({
            where: { id: itemToDelete.id },
            transaction: t,
          })
        }
      }
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return json({ error: error.message }, { status: 500 })
  }
}
