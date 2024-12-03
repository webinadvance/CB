import { DataTypes, Model } from 'sequelize'
import sequelize from '$lib/database/config.js'

class Page extends Model {}

Page.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING(200),
    slug: { type: DataTypes.STRING(200), unique: true },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
    contentData: {
      type: DataTypes.TEXT,
      get() {
        return JSON.parse(this.getDataValue('contentData') || '{}')
      },
      set(value) {
        this.setDataValue('contentData', JSON.stringify(value))
      },
    },
    componentName: DataTypes.STRING(100),
    paramSchema: {
      type: DataTypes.TEXT,
      get() {
        return JSON.parse(this.getDataValue('paramSchema') || '[]')
      },
      set(value) {
        this.setDataValue('paramSchema', JSON.stringify(value))
      },
    },
  },
  { sequelize, modelName: 'Page', tableName: 'Page' },
)

export { Page }
