import sequelize from '$lib/database/config.js'
import { DataTypes, Model } from 'sequelize'

class Page extends Model {}

Page.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING(200),
    slug: { type: DataTypes.STRING(200), unique: true, defaultValue: null },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
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
  {
    sequelize,
    modelName: 'Page',
  },
)

export { Page }
