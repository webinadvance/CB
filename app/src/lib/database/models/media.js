import { DataTypes, Model } from 'sequelize'
import sequelize from '$lib/database/config.js'

class Media extends Model {}

Media.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isIn: [
          [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
          ],
        ],
      },
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    content: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Media',
    tableName: 'Media',
    timestamps: true,
  },
)

export { Media }
//
