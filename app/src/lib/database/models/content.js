import { DataTypes } from 'sequelize'
import sequelize from '$lib/database/config.js'
import { Page } from './page.js'

import { DataTypes } from 'sequelize'
import sequelize from '$lib/database/config.js'
import { Page } from './page.js'

const Content = sequelize.define(
  'Content',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pageTitle: {
      type: DataTypes.STRING(200),
      allowNull: false,
      references: { model: Page, key: 'pageTitle' },
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    listIndex: { type: DataTypes.INTEGER, defaultValue: null },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['pageTitle', 'key', 'lang'],
      },
    ],
  },
)

Page.hasMany(Content, { foreignKey: 'pageTitle', as: 'contents' })
Content.belongsTo(Page, { foreignKey: 'pageTitle' })

export { Content }
