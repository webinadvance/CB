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

    // Define patterns with proper escaping for SQL Server
    // To match a literal '[', use '[[]'
    const deletePattern = `${key}[[]%.${index}`
    console.log('Delete Pattern:', deletePattern)

    const reindexPattern = `${key}[[]%.%`
    console.log('Reindex Pattern:', reindexPattern)

    // Start transaction
    await sequelize.transaction(async (t) => {
      // Fetch records before deletion
      const beforeDelete = await Content.findAll({
        where: { pageTitle, lang },
        raw: true,
        transaction: t,
      })
      console.log('DB State Before Deletion:', beforeDelete)

      // Delete matching records
      const deletedCount = await Content.destroy({
        where: {
          pageTitle,
          key: { [Op.like]: deletePattern },
          lang,
        },
        transaction: t,
      })
      console.log(`Number of Records Deleted: ${deletedCount}`)

      if (deletedCount === 0) {
        console.warn(
          'No records were deleted. Please check the delete pattern.',
        )
      }

      // Fetch remaining records after deletion
      const afterDelete = await Content.findAll({
        where: { pageTitle, lang },
        raw: true,
        transaction: t,
      })
      console.log('DB State After Deletion:', afterDelete)

      // Fetch all remaining records that match the reindex pattern
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
      console.log('Remaining Items for Reindexing:', remainingItems)

      // Iterate over remaining items to reindex
      for (const item of remainingItems) {
        console.log('Processing Item:', item)
        const regex = /^(.+?)\[(.+?)\]\.(\d+)$/
        const matches = item.key.match(regex)
        console.log('Regex Matches:', matches)

        if (matches) {
          const [, baseKey, tag, oldIndexStr] = matches
          const oldIndex = Number(oldIndexStr)
          console.log('Parsed Values:', { baseKey, tag, oldIndex })

          if (oldIndex > index) {
            const newIndex = oldIndex - 1
            const newKey = `${baseKey}[${tag}].${newIndex}`
            console.log(`Updating Key from ${item.key} to ${newKey}`)

            const updateResult = await Content.update(
              { key: newKey },
              { where: { id: item.id }, transaction: t },
            )
            console.log('Update Result:', updateResult)
          } else {
            console.log(`No reindexing needed for item with index ${oldIndex}`)
          }
        } else {
          console.log(`Key does not match pattern: ${item.key}`)
        }
      }

      // Final DB state after reindexing
      const finalState = await Content.findAll({
        where: { pageTitle, lang },
        raw: true,
        transaction: t,
      })
      console.log('Final DB State After Reindexing:', finalState)
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Error During DELETE Operation:', error)
    return json({ error: error.message }, { status: 500 })
  }
}
