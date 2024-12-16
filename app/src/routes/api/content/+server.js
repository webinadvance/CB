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
  const { pageTitle, fullKey, lang: requestLang } = await request.json()
  const lang = requestLang || get(langStore)
  if (!pageTitle || !fullKey)
    return json({ error: 'Invalid input parameters.' }, { status: 400 })

  const keyPatternWithTag = /^([^\[]+)\[([^\]]+)\]\.(\d+)$/
  const keyPatternNoTag = /^([^\[]+)\.(\d+)$/
  const matchWithTag = fullKey.match(keyPatternWithTag)
  const matchNoTag = fullKey.match(keyPatternNoTag)

  await sequelize.transaction(async (t) => {
    if (matchWithTag) {
      const [, key, tag, index] = matchWithTag
      await Content.destroy({
        where: { pageTitle, key: { [Op.eq]: `${key}[${tag}].${index}` }, lang },
        transaction: t,
      })
    } else if (matchNoTag) {
      const [, key, index] = matchNoTag
      const items = await Content.findAll({
        where: { pageTitle, key: { [Op.like]: `${key}.%` }, lang },
        order: [['key', 'ASC']],
        transaction: t,
      })
      const itemToDelete = items.find(
        (item) => Number(item.key.split('.').pop()) === Number(index),
      )
      if (itemToDelete) {
        await Content.destroy({
          where: { id: itemToDelete.id },
          transaction: t,
        })
      }
    } else {
      await Content.destroy({
        where: { pageTitle, key: { [Op.eq]: fullKey }, lang },
        transaction: t,
      })
    }
  })

  return new Response(null, { status: 204 })
}
