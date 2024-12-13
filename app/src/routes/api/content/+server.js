// FILE: app/src/routes/api/content/+server.js
import { json } from '@sveltejs/kit'
import { Content } from '$lib/database/models/content.js'
import { Op } from 'sequelize'
import { get } from 'svelte/store'
import { langStore } from '$lib/stores/langStore.js'
import sequelize from '$lib/database/config.js'

export async function POST({ request }) {
  try {
    let { pageTitle, key, value, lang } = await request.json()

    lang = lang || get(langStore)

    if (!pageTitle || !key) {
      return json({ error: 'Missing fields: pageTitle, key' }, { status: 400 })
    }

    if (!value?.trim()) {
      await Content.destroy({ where: { pageTitle, key, lang } })
      return new Response(null, { status: 204 })
    }

    const [content, created] = await Content.upsert(
      { pageTitle, key, value, lang },
      { returning: true },
    )

    return json(content, { status: created ? 201 : 200 })
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE({ request }) {
  try {
    const { pageTitle, key, index } = await request.json()
    const currentLang = get(langStore)

    if (pageTitle === undefined || key === undefined || index === undefined) {
      return json(
        { error: 'Missing fields: pageTitle, key, index' },
        { status: 400 },
      )
    }

    // Start transaction
    const transaction = await sequelize.transaction()

    try {
      // Delete the specified index
      const prefix = `${key}.${index}.`
      await Content.destroy({
        where: {
          pageTitle,
          key: { [Op.like]: `${prefix}%` },
          lang: currentLang,
        },
        transaction,
      })

      // Find all keys with index > deleted index
      const higherKeys = await Content.findAll({
        where: {
          pageTitle,
          key: { [Op.like]: `${key}.${index + 1}.%` },
          lang: currentLang,
        },
        transaction,
      })

      // Update each higher key to decrement the index
      for (const content of higherKeys) {
        const parts = content.key.split('.')
        const higherIndex = parseInt(parts[1], 10)
        const newIndex = higherIndex - 1
        parts[1] = newIndex.toString()
        const newKey = parts.join('.')

        await Content.update(
          { key: newKey },
          { where: { id: content.id }, transaction },
        )
      }

      await transaction.commit()
      return new Response(null, { status: 204 })
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}
