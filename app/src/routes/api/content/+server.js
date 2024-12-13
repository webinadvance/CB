import { json } from '@sveltejs/kit'
import { Content } from '$lib/database/models/content.js'
import { getServerLang } from '$lib/server/lang.js'

export async function POST({ request }) {
  try {
    let { pageTitle, key, value, lang } = await request.json()
    lang = lang || getServerLang()

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
//
