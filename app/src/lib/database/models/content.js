import { DataTypes } from 'sequelize'
import sequelize from '$lib/database/config.js'
import { Page } from './page.js'

const Content = sequelize.define('Content', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pageTitle: {
    type: DataTypes.STRING(200),
    allowNull: false,
    references: { model: Page, key: 'pageTitle' },
  },
  key: DataTypes.STRING(100),
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('value') || '{}')
    },
    set(value) {
      this.setDataValue('value', JSON.stringify(value))
    },
  },
  lang: {
    type: DataTypes.STRING(10), // Example: "en", "it"
    allowNull: false,
    defaultValue: 'en',
  },
})

Page.hasMany(Content, { foreignKey: 'pageTitle', as: 'contents' })
Content.belongsTo(Page, { foreignKey: 'pageTitle' })

export { Content }
