// FILE: app/src/routes/api/content/+server.js
import { json } from '@sveltejs/kit'
import { Content } from '$lib/database/models/content.js'

/**
 * Create a new content entry related to a pageTitle.
 */
export async function POST({ request }) {
  try {
    const { pageTitle, key, value, lang = 'en' } = await request.json()

    if (!pageTitle || !key || !value) {
      return json(
        { error: 'Missing required fields: pageTitle, key, value' },
        { status: 400 },
      )
    }

    // Check if a row exists for this key and pageTitle in the default language
    const existingDefaultLangContent = await Content.findOne({
      where: { pageTitle, key, lang: 'en' },
    })

    if (!existingDefaultLangContent && lang !== 'en') {
      // Create a placeholder row for the default language
      await Content.create({
        pageTitle,
        key,
        value: 'Default Content EN', // Placeholder for the default language
        lang: 'en',
      })
    }

    // Create the requested content
    const newContent = await Content.create({
      pageTitle,
      key,
      value,
      lang,
    })

    return json(newContent, { status: 201 })
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}

/**
 * Get content by content ID.
 */
export async function GET({ url }) {
  try {
    const id = url.searchParams.get('id')
    if (!id) {
      return json({ error: 'Content ID is required' }, { status: 400 })
    }

    const content = await Content.findByPk(id)
    if (!content) {
      return json({ error: 'Content not found' }, { status: 404 })
    }

    return json(content, { status: 200 })
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}

/**
 * Update content by content ID.
 */
export async function PUT({ request }) {
  try {
    const { id, value, lang } = await request.json()

    if (!id || !value || !lang) {
      return json(
        { error: 'Missing required fields: id, value, lang' },
        { status: 400 },
      )
    }

    const content = await Content.findByPk(id)
    if (!content) {
      return json({ error: 'Content not found' }, { status: 404 })
    }

    content.value = value
    content.lang = lang
    await content.save()

    // Ensure a complementary `en` row exists if not already
    const defaultContent = await Content.findOne({
      where: { pageTitle: content.pageTitle, key: content.key, lang: 'en' },
    })

    if (!defaultContent && lang !== 'en') {
      await Content.create({
        pageTitle: content.pageTitle,
        key: content.key,
        value: 'Default Content EN', // Placeholder for the default language
        lang: 'en',
      })
    }

    return json(content, { status: 200 })
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}

/**
 * Delete content by content ID.
 */
export async function DELETE({ request }) {
  try {
    const { id } = await request.json()

    if (!id) {
      return json({ error: 'Content ID is required' }, { status: 400 })
    }

    const content = await Content.findByPk(id)
    if (!content) {
      return json({ error: 'Content not found' }, { status: 404 })
    }

    await content.destroy()
    return new Response(null, { status: 204 })
  } catch (error) {
    return json({ error: error.message }, { status: 500 })
  }
}
