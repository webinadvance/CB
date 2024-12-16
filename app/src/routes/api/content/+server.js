import { json } from '@sveltejs/kit'
import { Content } from '$lib/database/models/content.js'
import { get } from 'svelte/store'
import { langStore } from '$lib/stores/langStore.js'
import { queryCache } from '$lib/cache/queryCache.js'
import sequelize from '$lib/database/config.js'
import { Op } from 'sequelize'

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

const reindexContent = async (
  items,
  keyPattern,
  deletedIndex,
  transaction,
  generateNewKey,
) => {
  for (const item of items) {
    const match = item.key.match(keyPattern)
    if (match && +match[match.length - 1] > +deletedIndex) {
      const newKey = generateNewKey(match)
      await Content.update(
        { key: newKey },
        { where: { id: item.id }, transaction },
      )
    }
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
    const destroyContent = (pattern, params = {}) =>
      Content.destroy({
        where: { pageTitle, lang, ...params, key: { [Op.like]: pattern } },
        transaction: t,
      })

    if (matchWithTag) {
      const [, key, , index] = matchWithTag
      const prefixPattern =
        sequelize.dialect.name === 'mssql' ? `${key}[[]%]` : `${key}[%]`
      const items = await Content.findAll({
        where: { pageTitle, key: { [Op.like]: `${prefixPattern}.%` }, lang },
        order: [['key', 'ASC']],
        transaction: t,
      })
      await destroyContent(`${prefixPattern}.${index}`)
      await reindexContent(
        items,
        keyPatternWithTag,
        index,
        t,
        (m) => `${m[1]}[${m[2]}].${+m[3] - 1}`,
      )
    } else if (matchNoTag) {
      const [, key, index] = matchNoTag
      const items = await Content.findAll({
        where: { pageTitle, key: { [Op.like]: `${key}.%` }, lang },
        order: [['key', 'ASC']],
        transaction: t,
      })
      await destroyContent(`${key}.${index}`)
      await reindexContent(
        items,
        keyPatternNoTag,
        index,
        t,
        (m) => `${key}.${+m[2] - 1}`,
      )
    } else {
      await Content.destroy({
        where: { pageTitle, key: { [Op.eq]: fullKey }, lang },
        transaction: t,
      })
    }
  })
  return new Response(null, { status: 204 })
}
