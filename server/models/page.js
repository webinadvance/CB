import { DataTypes, Model } from "sequelize";
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
      validate: {
        notContains: " ",
      },
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
    componentName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    paramSchema: {
      type: DataTypes.TEXT,
      get() {
        const raw = this.getDataValue("paramSchema");
        return raw ? JSON.parse(raw) : [];
      },
      set(value) {
        this.setDataValue("paramSchema", JSON.stringify(value));
      },
    },
  },
  {
    sequelize,
    modelName: "Page",
  },
);
