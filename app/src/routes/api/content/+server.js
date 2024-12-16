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
    // Parse request body
    const body = await request.json()
    console.log('Request Body:', body)

    const { pageTitle, key, index, lang: requestLang } = body
    const lang = requestLang || get(langStore)
    console.log('Parameters:', { pageTitle, key, index, lang })

    // Define pattern to delete with proper escaping for SQL Server
    // In SQL Server, to match a literal '[', use '[[]'
    const deletePattern = `${key}[[]%.${index}`
    console.log('Delete Pattern:', deletePattern)

    // Fetch records before deletion
    const beforeDelete = await Content.findAll({
      where: { pageTitle, lang },
      raw: true,
    })
    console.log('DB State Before Deletion:', beforeDelete)

    // Delete matching records
    const deletedCount = await Content.destroy({
      where: {
        pageTitle,
        key: { [Op.like]: deletePattern },
        lang,
      },
    })
    console.log(`Number of Records Deleted: ${deletedCount}`)

    // Fetch records after deletion
    const afterDelete = await Content.findAll({
      where: { pageTitle, lang },
      raw: true,
    })
    console.log('DB State After Deletion:', afterDelete)

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Error During DELETE Operation:', error)
    return json({ error: error.message }, { status: 500 })
  }
}
