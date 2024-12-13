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

// In DELETE API
export async function DELETE({ request }) {
  try {
    const { pageTitle, key, index } = await request.json()

    // 1. Delete target items
    await Content.destroy({
      where: {
        pageTitle,
        key: { [Op.startsWith]: `${key}.${index}.` },
      },
    })

    // 2. Fix indexes for remaining items
    const remainingItems = await Content.findAll({
      where: {
        pageTitle,
        key: { [Op.startsWith]: `${key}.` },
      },
      order: [['key', 'ASC']],
    })

    // 3. Update indexes sequentially
    await sequelize.transaction(async (t) => {
      for (let i = 0; i < remainingItems.length; i++) {
        const item = remainingItems[i]
        const [_, currentIndex, field] = item.key.split('.')
        if (Number(currentIndex) !== Math.floor(i / 2)) {
          await Content.update(
            { key: `${key}.${Math.floor(i / 2)}.${field}` },
            { where: { id: item.id }, transaction: t },
          )
        }
      }
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}
