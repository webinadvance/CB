// FILE: app/src/routes/api/content/+server.js
import { json } from '@sveltejs/kit'
import { Content } from '$lib/database/models/content.js'
import { getServerLang } from '$lib/server/lang.js'

export async function POST({ request }) {
  try {
    let { pageTitle, key, value, lang } = await request.json()
    lang = lang || getServerLang() // Use server language if not provided

    if (!pageTitle || !key || !value) {
      return json(
        { error: 'Missing required fields: pageTitle, key, value' },
        { status: 400 },
      )
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
 * Update content by content ID.
 */
export async function PUT({ request }) {
  try {
    let { id, value, lang } = await request.json()
    lang = lang || getServerLang() // Use server language if not provided

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

    return json(content, { status: 200 })
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
