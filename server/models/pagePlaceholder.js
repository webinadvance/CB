import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/config.js";
import { Page } from "./page.js";

export class PagePlaceholder extends Model {}

PagePlaceholder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
    },
    contentType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PagePlaceholder",
    indexes: [
      {
        unique: true,
        fields: ["pageId", "key"],
      },
    ],
  },
);

// Set up relationships
Page.hasMany(PagePlaceholder, {
  as: "placeholders",
  foreignKey: "pageId",
});
PagePlaceholder.belongsTo(Page, {
  foreignKey: "pageId",
});
