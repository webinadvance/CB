import { DataTypes } from 'sequelize'
import sequelize from '$lib/database/config.js'
import { Page } from './page.js'

const Content = sequelize.define(
  'Content',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pageTitle: {
      type: DataTypes.STRING(200),
      allowNull: false,
      references: { model: Page, key: 'pageTitle' },
    },
    key: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lang: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'en',
    },
  },
  {
    uniqueKeys: {
      content_unique: {
        fields: ['pageTitle', 'key', 'tag', 'index', 'lang'],
      },
    },
  },
)

Page.hasMany(Content, { foreignKey: 'pageTitle', as: 'contents' })
Content.belongsTo(Page, { foreignKey: 'pageTitle' })

export { Content }
//
