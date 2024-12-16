import { json } from '@sveltejs/kit'
import { Content } from '$lib/database/models/content.js'
import sequelize from '$lib/database/config.js'
import { Op } from 'sequelize'

export async function POST({ request }) {
  const { pageTitle, key, updates } = await request.json()

  await sequelize.transaction(async (t) => {
    const prefixPattern =
      sequelize.dialect.name === 'mssql' ? `${key}[[]%]` : `${key}[%]`

    const records = await Content.findAll({
      where: {
        pageTitle,
        key: { [Op.like]: `${prefixPattern}.%` },
      },
      transaction: t,
    })

    const swappedRecords = records.map((record) => {
      const match = record.key.match(/\[([^\]]+)\]\.(\d+)$/)
      if (!match) return record
      const [, tag, index] = match
      const update = updates.find((u) => u.oldIndex === parseInt(index))
      if (!update) return record

      return {
        pageTitle: record.pageTitle,
        key: `${key}[${tag}].${update.newIndex}`,
        value: record.value,
        lang: record.lang,
      }
    })

    await Content.destroy({
      where: {
        pageTitle,
        key: { [Op.like]: `${prefixPattern}.%` },
      },
      transaction: t,
    })

    await Content.bulkCreate(swappedRecords, { transaction: t })
  })

  return json({ success: true })
}
