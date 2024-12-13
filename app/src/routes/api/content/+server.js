// FILE: app/src/routes/api/content/+server.js
import { json } from '@sveltejs/kit'
import { Content } from '$lib/database/models/content.js'
import { Op } from 'sequelize'
import { get } from 'svelte/store'
import { langStore } from '$lib/stores/langStore.js'

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
    const lang = get(langStore)

    if (!pageTitle || !key || index === undefined) {
      return json(
        { error: 'Missing fields: pageTitle, key, index' },
        { status: 400 },
      )
    }

    // Delete the specified index
    const prefix = `${key}.${index}.`
    await Content.destroy({
      where: {
        pageTitle,
        key: { [Op.like]: `${prefix}%` },
        lang,
      },
    })

    // Find all higher indices and decrement them
    const higherKeys = await Content.findAll({
      where: {
        pageTitle,
        key: { [Op.like]: `${key}.${index + 1}.%` },
        lang,
      },
    })

    for (const content of higherKeys) {
      const parts = content.key.split('.')
      const currentIndex = parseInt(parts[1], 10)
      const newKey = [key, currentIndex - 1, ...parts.slice(2)].join('.')
      await Content.update({ key: newKey }, { where: { id: content.id } })
    }

    return new Response(null, { status: 204 })
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}
