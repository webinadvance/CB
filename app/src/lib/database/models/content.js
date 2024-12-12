import { DataTypes, Model } from 'sequelize'
import sequelize from '$lib/database/config.js'
import { Page } from './page.js'

const Content = sequelize.define('Content', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pageId: { type: DataTypes.INTEGER, allowNull: false },
  key: DataTypes.STRING(100),
  value: {
    type: DataTypes.TEXT,
    get() {
      return JSON.parse(this.getDataValue('value') || '{}')
    },
    set(value) {
      this.setDataValue('value', JSON.stringify(value))
    },
  },
})

Page.hasMany(Content, { foreignKey: 'pageId', as: 'contents' })
Content.belongsTo(Page, { foreignKey: 'pageId' })

export { Content }
