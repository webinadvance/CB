import { json } from '@sveltejs/kit'
import { Content } from '$lib/database/models/content.js'
import { get } from 'svelte/store'
import { langStore } from '$lib/stores/langStore.js'
import { Op } from 'sequelize'
export async function GET({ url }) {
  const pageTitle = url.searchParams.get('pageTitle')
  const requestLang = url.searchParams.get('lang')
  const lang = requestLang || get(langStore)

  // Set query filters based on presence of `pageTitle` and `lang`.
  const where = {}
  if (pageTitle) where.pageTitle = pageTitle
  if (lang) where.lang = lang

  try {
    // Fetch all matching content
    const content = await Content.findAll({ where })
    return json(content, { status: 200 })
  } catch (error) {
    console.error('Error fetching page data:', error)
    return json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
export async function POST({ request }) {
  const {
    pageTitle,
    key,
    tag = null,
    index = null,
    value,
    lang: payloadLang,
  } = await request.json()
  const lang = payloadLang || get(langStore)
  if (!pageTitle || !key)
    return json({ error: 'Missing required fields' }, { status: 400 })
  const where = { pageTitle, key, tag, index, lang }
  const existing = await Content.findOne({ where })
  return json(
    existing
      ? await existing.update({ value })
      : await Content.create({ ...where, value }),
    { status: existing ? 200 : 201 },
  )
}
export async function DELETE({ request }) {
  const {
    pageTitle,
    key,
    tag,
    index,
    lang: requestLang,
    strict = false,
  } = await request.json()
  const lang = requestLang || get(langStore)
  if (!pageTitle || !key)
    return json({ error: 'Missing required fields' }, { status: 400 })
  const where = { pageTitle, key, lang }
  if (typeof index === 'number') {
    where.index = index
    if (!strict) where.tag = tag
    await Content.destroy({ where })
    const tags = strict
      ? await Content.findAll({
          attributes: ['tag'],
          where: { pageTitle, key, lang },
          group: ['tag'],
          raw: true,
        })
      : [{ tag }]
    for (const { tag } of tags)
      await Promise.all(
        (
          await Content.findAll({
            where: { pageTitle, key, tag, index: { [Op.gt]: index }, lang },
            order: [['index', 'ASC']],
          })
        ).map((item) => item.update({ index: item.index - 1 })),
      )
  } else {
    if (tag !== undefined) where.tag = tag
    await Content.destroy({ where })
  }
  return new Response(null, { status: 204 })
}
