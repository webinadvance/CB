import { DataTypes, Model } from 'sequelize'
import sequelize from '$lib/database/config.js'

class Media extends Model {}

Media.init(
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    filename: { 
      type: DataTypes.STRING(255),
      allowNull: false
    },
    originalFilename: { 
      type: DataTypes.STRING(255),
      allowNull: false 
    },
    mimeType: { 
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isIn: [['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']]
      }
    },
    size: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    width: { 
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    height: { 
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    path: { 
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true
    },
    hash: { 
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'SHA-256 hash of file content'
    },
    alt: { 
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Alternative text for accessibility'
    },
    title: { 
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: { 
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('metadata');
        return value ? JSON.parse(value) : {};
      },
      set(value) {
        this.setDataValue('metadata', JSON.stringify(value));
      },
      comment: 'Additional metadata like EXIF data, color profile, etc.'
    },
    uploadedBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'User who uploaded the file'
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Media',
    tableName: 'Media',
    indexes: [
      {
        fields: ['mimeType']
      },
      {
        fields: ['hash']
      },
      {
        fields: ['uploadedBy']
      }
    ],
    timestamps: true
  }
)

export { Media }
