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
    // Step 1: Parse Request Body
    const body = await request.json()
    console.log('--- DELETE Request Received ---')
    console.log('Request Body:', JSON.stringify(body, null, 2))

    const { pageTitle, key, index, lang: requestLang } = body
    const lang = requestLang || get(langStore)
    console.log('Parsed Parameters:', { pageTitle, key, index, lang })

    // Validate Input
    if (!pageTitle || !key || typeof index !== 'number') {
      console.error('Invalid input parameters.')
      return json({ error: 'Invalid input parameters.' }, { status: 400 })
    }

    // Step 2: Detect if the Base Key Has Bracketed Variants
    console.log('Checking if the base key has bracketed variants...')
    const bracketedKeyExists = await Content.findOne({
      where: {
        pageTitle,
        key: { [Op.like]: `${key}[%].%` },
        lang,
      },
      attributes: ['id'],
      raw: true,
    })

    const hasBrackets = !!bracketedKeyExists
    console.log(`Key has brackets: ${hasBrackets}`)

    // Step 3: Define Delete and Reindex Patterns
    let deletePattern, reindexPattern, deleteCondition

    if (hasBrackets) {
      // Escape [ and ] for SQL Server LIKE
      const escapedKey = key.replace(/[[\]]/g, (match) =>
        match === '[' ? '[[]' : '[]]',
      )
      deletePattern = `${escapedKey}[%].${index}`
      reindexPattern = `${escapedKey}[%].%`
      deleteCondition = { [Op.like]: deletePattern }
      console.log('Bracketed Key Patterns:')
      console.log('Delete Pattern:', deletePattern)
      console.log('Reindex Pattern:', reindexPattern)
    } else {
      // Exact match for keys without brackets
      deletePattern = `${key}.${index}`
      reindexPattern = `${key}.%`
      deleteCondition = { [Op.eq]: deletePattern }
      console.log('Non-Bracketed Key Patterns:')
      console.log('Delete Pattern:', deletePattern)
      console.log('Reindex Pattern:', reindexPattern)
    }

    // Step 4: Begin Transaction
    console.log('Initiating database transaction...')
    await sequelize.transaction(async (t) => {
      // Step 4.1: Fetch Records Before Deletion
      console.log('Fetching records before deletion...')
      const beforeDelete = await Content.findAll({
        where: { pageTitle, lang },
        raw: true,
        transaction: t,
      })
      console.log(
        'DB State Before Deletion:',
        JSON.stringify(beforeDelete, null, 2),
      )

      // Step 4.2: Delete Matching Records
      console.log('Attempting to delete matching records...')
      const deletedCount = await Content.destroy({
        where: {
          pageTitle,
          key: deleteCondition,
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

      // Step 4.3: Fetch Records After Deletion
      console.log('Fetching records after deletion...')
      const afterDelete = await Content.findAll({
        where: { pageTitle, lang },
        raw: true,
        transaction: t,
      })
      console.log(
        'DB State After Deletion:',
        JSON.stringify(afterDelete, null, 2),
      )

      // Step 4.4: Fetch Remaining Items for Reindexing
      console.log('Fetching remaining items for reindexing...')
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
      console.log(
        'Remaining Items for Reindexing:',
        JSON.stringify(remainingItems, null, 2),
      )

      // Step 4.5: Define Regex Based on Key Type
      const regex = hasBrackets ? /^(.+?)\[(.+?)\]\.(\d+)$/ : /^(.+?)\.(\d+)$/
      console.log('Using Regex:', regex.toString())

      // Step 4.6: Iterate Over Remaining Items to Reindex
      for (const item of remainingItems) {
        console.log('Processing Item:', JSON.stringify(item, null, 2))
        const matches = item.key.match(regex)
        console.log('Regex Matches:', matches)

        if (matches) {
          let baseKey, tag, oldIndex

          if (hasBrackets) {
            ;[, baseKey, tag, oldIndex] = matches
          } else {
            ;[, baseKey, oldIndex] = matches
          }

          oldIndex = Number(oldIndex)
          console.log('Parsed Values:', { baseKey, tag, oldIndex })

          if (oldIndex > index) {
            const newIndex = oldIndex - 1
            let newKey

            if (hasBrackets) {
              newKey = `${baseKey}[${tag}].${newIndex}`
            } else {
              newKey = `${baseKey}.${newIndex}`
            }

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

      // Step 4.7: Fetch Final DB State After Reindexing
      console.log('Fetching final DB state after reindexing...')
      const finalState = await Content.findAll({
        where: { pageTitle, lang },
        raw: true,
        transaction: t,
      })
      console.log(
        'Final DB State After Reindexing:',
        JSON.stringify(finalState, null, 2),
      )
    })

    // Step 5: Return Success Response
    console.log('DELETE operation completed successfully.')
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Error During DELETE Operation:', error)
    return json({ error: error.message }, { status: 500 })
  }
}
