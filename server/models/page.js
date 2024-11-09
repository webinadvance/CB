import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/config.js";

export class Page extends Model {}
Page.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    redirectUrl: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Page",
  },
);
