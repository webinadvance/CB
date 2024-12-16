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
    const { pageTitle, fullKey, lang: requestLang } = await request.json()

    // Extract the language or fallback to langStore
    const lang = requestLang || get(langStore)

    // Validate input
    if (!pageTitle || !fullKey) {
      return json({ error: 'Invalid input parameters.' }, { status: 400 })
    }

    // Check if the key is in {key}[{tag}].{index} format
    const keyPatternWithTag = /^([^\[]+)\[([^\]]+)\]\.(\d+)$/
    const matchWithTag = fullKey.match(keyPatternWithTag)

    // Check if the key is in {key}.{index} format
    const keyPatternNoTag = /^([^\[]+)\.(\d+)$/
    const matchNoTag = fullKey.match(keyPatternNoTag)

    // Prepare transaction
    await sequelize.transaction(async (t) => {
      if (matchWithTag) {
        // Extract components for {key}[{tag}].{index}
        const [, key, tag, indexString] = matchWithTag
        const index = Number(indexString)

        // Handle deletion for keys with brackets
        const bracketPattern = `${key}[${tag}].${index}`
        await Content.destroy({
          where: { pageTitle, key: { [Op.eq]: bracketPattern }, lang },
          transaction: t,
        })
      } else if (matchNoTag) {
        // Extract components for {key}.{index}
        const [, key, indexString] = matchNoTag
        const index = Number(indexString)

        // Handle deletion for keys without brackets
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
      } else {
        // Handle deletion for simple keys (keys that don't match the patterns)
        await Content.destroy({
          where: { pageTitle, key: { [Op.eq]: fullKey }, lang },
          transaction: t,
        })
      }
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return json({ error: error.message }, { status: 500 })
  }
}
